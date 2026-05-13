import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(10),
  applicationId: z.string().cuid(),
  attachmentKeys: z.array(z.string()).optional(),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { title, description, applicationId, attachmentKeys = [] } = parsed.data;

  const feature = await db.feature.create({
    data: {
      title,
      description,
      applicationId,
      authorId: session.user.id,
      attachments: {
        createMany: {
          data: attachmentKeys.map((key) => ({
            key,
            url: `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
            name: key.split("/").pop() ?? key,
            size: 0,
            mimeType: "application/octet-stream",
          })),
        },
      },
    },
    include: { application: true, author: { select: { name: true, image: true } } },
  });

  return NextResponse.json(feature, { status: 201 });
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const app = searchParams.get("app") ?? "";
  const limit = Math.min(Number(searchParams.get("limit") ?? 20), 50);

  const features = await db.feature.findMany({
    where: {
      ...(app ? { application: { slug: app } } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: {
      application: true,
      author: { select: { name: true, image: true } },
      _count: { select: { votes: true, comments: true } },
      votes: { where: { userId: session.user.id }, select: { id: true } },
    },
    orderBy: { voteCount: "desc" },
    take: limit,
  });

  return NextResponse.json(features);
}
