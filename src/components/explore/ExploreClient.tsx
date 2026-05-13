"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import { FeatureCard } from "./FeatureCard";

interface Application {
  id: string;
  name: string;
  slug: string;
}

interface Feature {
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
}

interface ExploreClientProps {
  features: Feature[];
  applications: Application[];
  currentUserId: string;
  initialQuery: string;
  initialApp: string;
}

export function ExploreClient({
  features,
  applications,
  currentUserId,
  initialQuery,
  initialApp,
}: ExploreClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      startTransition(() => router.push(`${pathname}?${params.toString()}`));
    },
    [pathname, router, searchParams]
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <input
            type="search"
            defaultValue={initialQuery}
            onChange={(e) => update("q", e.target.value)}
            placeholder="Buscar ideas..."
            className="input pl-9"
          />
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>
        </div>
        <select
          defaultValue={initialApp}
          onChange={(e) => update("app", e.target.value)}
          className="input sm:w-52"
        >
          <option value="">Todas las aplicaciones</option>
          {applications.map((app) => (
            <option key={app.id} value={app.slug}>
              {app.name}
            </option>
          ))}
        </select>
      </div>

      {isPending ? (
        <div className="flex justify-center py-12">
          <span className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-brand-500" />
        </div>
      ) : features.length === 0 ? (
        <div className="card text-center py-16 text-gray-500">
          <p className="text-2xl mb-2">💡</p>
          <p className="font-medium text-gray-700">No hay ideas todavía</p>
          <p className="text-sm mt-1">¡Sé el primero en enviar una sugerencia!</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-gray-500 mb-4">
            {features.length} {features.length === 1 ? "idea" : "ideas"} encontradas
          </p>
          {features.map((f) => (
            <FeatureCard key={f.id} feature={f} currentUserId={currentUserId} />
          ))}
        </div>
      )}
    </div>
  );
}
