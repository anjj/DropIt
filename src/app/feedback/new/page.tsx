import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { FeedbackForm } from "@/components/feedback/FeedbackForm";

export default async function NewFeedbackPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/api/auth/signin");

  const applications = await db.application.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Enviar sugerencia</h1>
        <p className="text-gray-600 mt-1">
          Comparte tu idea o mejora. Revisaremos si ya existe algo similar.
        </p>
      </div>
      <FeedbackForm applications={applications} />
    </div>
  );
}
