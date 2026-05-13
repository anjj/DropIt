"use client";

import { useState } from "react";

interface VoteButtonProps {
  featureId: string;
  initialCount: number;
  initialVoted: boolean;
}

export function VoteButton({ featureId, initialCount, initialVoted }: VoteButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [voted, setVoted] = useState(initialVoted);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    if (loading) return;
    setLoading(true);

    const optimistic = !voted;
    setVoted(optimistic);
    setCount((c) => c + (optimistic ? 1 : -1));

    try {
      const res = await fetch(`/api/features/${featureId}/votes`, { method: "POST" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setVoted(data.voted);
    } catch {
      setVoted(!optimistic);
      setCount((c) => c + (optimistic ? -1 : 1));
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`flex flex-col items-center gap-1 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors min-w-[56px] ${
        voted
          ? "border-brand-500 bg-brand-50 text-brand-600"
          : "border-gray-200 bg-white text-gray-600 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600"
      } disabled:opacity-60`}
      title={voted ? "Quitar voto" : "Votar por esta idea"}
    >
      <span className="text-lg leading-none">{voted ? "▲" : "△"}</span>
      <span>{count}</span>
    </button>
  );
}
