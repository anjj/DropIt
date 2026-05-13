import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { generateUploadUrl } from "@/lib/s3";
import { z } from "zod";

const uploadSchema = z.object({
  filename: z.string().min(1).max(255),
  contentType: z.string().min(1),
  size: z.number().positive().max(10 * 1024 * 1024), // 10 MB max
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = uploadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { filename, contentType } = parsed.data;
  const key = `uploads/${session.user.id}/${Date.now()}-${filename}`;

  const url = await generateUploadUrl(key, contentType);

  return NextResponse.json({ url, key });
}
