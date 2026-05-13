import Link from "next/link";
import { VoteButton } from "@/components/ui/VoteButton";

interface FeatureCardProps {
  feature: {
    id: string;
    title: string;
    description: string;
    voteCount: number;
    status: string;
    createdAt: Date | string;
    application: { name: string; slug: string };
    author: { name: string | null; image: string | null };
    _count: { votes: number; comments: number };
    votes: { id: string }[];
  };
  currentUserId: string;
}

const STATUS_LABELS: Record<string, { label: string; class: string }> = {
  OPEN: { label: "Abierta", class: "bg-blue-50 text-blue-700" },
  PLANNED: { label: "Planificada", class: "bg-purple-50 text-purple-700" },
  IN_PROGRESS: { label: "En desarrollo", class: "bg-yellow-50 text-yellow-700" },
  COMPLETED: { label: "Completada", class: "bg-green-50 text-green-700" },
  REJECTED: { label: "Rechazada", class: "bg-red-50 text-red-700" },
};

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "");
}

export function FeatureCard({ feature, currentUserId }: FeatureCardProps) {
  const voted = feature.votes.length > 0;
  const status = STATUS_LABELS[feature.status] ?? STATUS_LABELS.OPEN;

  return (
    <div className="card flex gap-4 hover:border-brand-200 transition-colors">
      <VoteButton
        featureId={feature.id}
        initialCount={feature.voteCount}
        initialVoted={voted}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-1">
          <Link
            href={`/features/${feature.id}`}
            className="text-base font-semibold text-gray-900 hover:text-brand-600 transition-colors"
          >
            {feature.title}
          </Link>
          <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${status.class}`}>
            {status.label}
          </span>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {stripHtml(feature.description)}
        </p>

        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 font-medium text-gray-700">
            {feature.application.name}
          </span>
          <span>{feature._count.comments} comentarios</span>
          <span>·</span>
          <span>
            {feature.author.name} ·{" "}
            {new Date(feature.createdAt).toLocaleDateString("es-ES", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
