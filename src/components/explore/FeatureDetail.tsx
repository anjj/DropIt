"use client";

import Link from "next/link";
import { useState } from "react";
import { VoteButton } from "@/components/ui/VoteButton";

interface Comment {
  id: string;
  content: string;
  createdAt: Date | string;
  author: { name: string | null; image: string | null };
}

interface FeatureDetailProps {
  feature: {
    id: string;
    title: string;
    description: string;
    voteCount: number;
    status: string;
    createdAt: Date | string;
    application: { name: string; slug: string };
    author: { name: string | null; image: string | null; email: string | null };
    attachments: { id: string; url: string; name: string }[];
    votes: { id: string }[];
    comments: Comment[];
    _count: { votes: number; comments: number };
  };
  currentUserId: string;
}

export function FeatureDetail({ feature, currentUserId }: FeatureDetailProps) {
  const [comments, setComments] = useState<Comment[]>(feature.comments);
  const [newComment, setNewComment] = useState("");
  const [posting, setPosting] = useState(false);

  async function postComment(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim() || posting) return;
    setPosting(true);

    try {
      const res = await fetch(`/api/features/${feature.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment.trim() }),
      });
      if (!res.ok) throw new Error();
      const comment = await res.json();
      setComments((c) => [...c, comment]);
      setNewComment("");
    } catch {
    } finally {
      setPosting(false);
    }
  }

  return (
    <div>
      <div className="mb-4">
        <Link href="/explore" className="text-sm text-gray-500 hover:text-gray-700">
          ← Volver a ideas
        </Link>
      </div>

      <div className="card mb-6">
        <div className="flex gap-4">
          <VoteButton
            featureId={feature.id}
            initialCount={feature.voteCount}
            initialVoted={feature.votes.length > 0}
          />
          <div className="flex-1">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h1 className="text-xl font-bold text-gray-900">{feature.title}</h1>
              <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                {feature.application.name}
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              {feature.author.name} ·{" "}
              {new Date(feature.createdAt).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <div
              className="prose prose-sm max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: feature.description }}
            />

            {feature.attachments.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-700 mb-2">Archivos adjuntos</p>
                <ul className="space-y-1">
                  {feature.attachments.map((att) => (
                    <li key={att.id}>
                      <a
                        href={att.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-brand-600 hover:underline"
                      >
                        📎 {att.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          Comentarios ({comments.length})
        </h2>

        {comments.length === 0 && (
          <p className="text-sm text-gray-500 mb-4">Aún no hay comentarios. ¡Sé el primero!</p>
        )}

        <ul className="space-y-4 mb-6">
          {comments.map((c) => (
            <li key={c.id} className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 text-xs font-medium">
                {c.author.name?.[0]?.toUpperCase() ?? "?"}
              </span>
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-700">
                  {c.author.name} ·{" "}
                  {new Date(c.createdAt).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "short",
                  })}
                </p>
                <p className="text-sm text-gray-700 mt-0.5">{c.content}</p>
              </div>
            </li>
          ))}
        </ul>

        <form onSubmit={postComment} className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escribe un comentario..."
            className="input flex-1"
            maxLength={2000}
          />
          <button
            type="submit"
            disabled={!newComment.trim() || posting}
            className="btn-primary"
          >
            {posting ? "..." : "Comentar"}
          </button>
        </form>
      </div>
    </div>
  );
}
