import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const featureId = params.id;
  const userId = session.user.id;

  const existing = await db.vote.findUnique({
    where: { featureId_userId: { featureId, userId } },
  });

  if (existing) {
    await db.$transaction([
      db.vote.delete({ where: { featureId_userId: { featureId, userId } } }),
      db.feature.update({
        where: { id: featureId },
        data: { voteCount: { decrement: 1 } },
      }),
    ]);
    return NextResponse.json({ voted: false });
  }

  await db.$transaction([
    db.vote.create({ data: { featureId, userId } }),
    db.feature.update({
      where: { id: featureId },
      data: { voteCount: { increment: 1 } },
    }),
  ]);

  return NextResponse.json({ voted: true });
}
