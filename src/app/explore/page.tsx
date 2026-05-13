import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ExploreClient } from "@/components/explore/ExploreClient";

interface ExplorePageProps {
  searchParams: { q?: string; app?: string };
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/api/auth/signin");

  const { q, app } = searchParams;

  const [features, applications] = await Promise.all([
    db.feature.findMany({
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
    }),
    db.application.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Explorar ideas</h1>
        <p className="text-gray-600 mt-1">
          Descubre qué están pidiendo otros usuarios y vota por lo que más necesitas.
        </p>
      </div>
      <ExploreClient
        features={features}
        applications={applications}
        currentUserId={session.user.id}
        initialQuery={q ?? ""}
        initialApp={app ?? ""}
      />
    </div>
  );
}
