import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/db";
import { FeatureDetail } from "@/components/explore/FeatureDetail";

interface FeaturePageProps {
  params: { id: string };
}

export default async function FeaturePage({ params }: FeaturePageProps) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/api/auth/signin");

  const feature = await db.feature.findUnique({
    where: { id: params.id },
    include: {
      application: true,
      author: { select: { name: true, image: true, email: true } },
      attachments: true,
      votes: { where: { userId: session.user.id }, select: { id: true } },
      comments: {
        include: { author: { select: { name: true, image: true } } },
        orderBy: { createdAt: "asc" },
      },
      _count: { select: { votes: true, comments: true } },
    },
  });

  if (!feature) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <FeatureDetail feature={feature} currentUserId={session.user.id} />
    </div>
  );
}
