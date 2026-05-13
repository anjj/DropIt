import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const commentSchema = z.object({
  content: z.string().min(1).max(2000),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = commentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const comment = await db.comment.create({
    data: {
      content: parsed.data.content,
      featureId: params.id,
      authorId: session.user.id,
    },
    include: { author: { select: { name: true, image: true } } },
  });

  return NextResponse.json(comment, { status: 201 });
}
