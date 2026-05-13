"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useDebounce } from "@/lib/hooks";

interface SimilarFeature {
  id: string;
  title: string;
  voteCount: number;
  application: { name: string };
}

interface DuplicateDetectorProps {
  title: string;
  applicationId: string;
}

export function DuplicateDetector({ title, applicationId }: DuplicateDetectorProps) {
  const [similar, setSimilar] = useState<SimilarFeature[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedTitle = useDebounce(title, 500);

  useEffect(() => {
    if (debouncedTitle.length < 5) {
      setSimilar([]);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetch(`/api/features?q=${encodeURIComponent(debouncedTitle)}&limit=3`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setSimilar(data.slice(0, 3));
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [debouncedTitle, applicationId]);

  if (loading) {
    return (
      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
        <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-brand-500" />
        Buscando ideas similares...
      </p>
    );
  }

  if (!similar.length) return null;

  return (
    <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
      <p className="text-sm font-medium text-amber-800 mb-2">
        Encontramos ideas similares. Considera votar por una existente antes de crear una nueva:
      </p>
      <ul className="space-y-2">
        {similar.map((f) => (
          <li key={f.id} className="flex items-center justify-between gap-3">
            <Link
              href={`/features/${f.id}`}
              target="_blank"
              className="text-sm text-amber-700 hover:text-amber-900 hover:underline flex-1 truncate"
            >
              {f.title}
            </Link>
            <span className="shrink-0 text-xs text-amber-600 bg-amber-100 rounded-full px-2 py-0.5">
              {f.voteCount} votos · {f.application.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
