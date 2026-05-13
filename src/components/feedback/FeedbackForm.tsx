"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RichTextEditor } from "./RichTextEditor";
import { DuplicateDetector } from "./DuplicateDetector";
import { FileUpload } from "./FileUpload";

interface Application {
  id: string;
  name: string;
  slug: string;
}

interface FeedbackFormProps {
  applications: Application[];
}

export function FeedbackForm({ applications }: FeedbackFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [applicationId, setApplicationId] = useState(applications[0]?.id ?? "");
  const [attachmentKeys, setAttachmentKeys] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;

    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/features", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, applicationId, attachmentKeys }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.formErrors?.[0] ?? "Error al enviar la sugerencia");
      }

      const feature = await res.json();
      router.push(`/features/${feature.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-6">
      <div>
        <label htmlFor="application" className="label">
          Aplicación
        </label>
        <select
          id="application"
          value={applicationId}
          onChange={(e) => setApplicationId(e.target.value)}
          className="input"
          required
        >
          {applications.map((app) => (
            <option key={app.id} value={app.id}>
              {app.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="title" className="label">
          Título de la sugerencia
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Resumen breve de tu idea..."
          className="input"
          required
          minLength={5}
          maxLength={200}
        />
        <DuplicateDetector title={title} applicationId={applicationId} />
      </div>

      <div>
        <label className="label">Descripción detallada</label>
        <RichTextEditor
          value={description}
          onChange={setDescription}
          placeholder="Explica el problema que resuelve y cómo debería funcionar..."
        />
      </div>

      <div>
        <label className="label">Archivos adjuntos (opcional)</label>
        <FileUpload
          onUpload={(files) => setAttachmentKeys(files.map((f) => f.key))}
        />
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-secondary"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={submitting || !title || !description || !applicationId}
          className="btn-primary"
        >
          {submitting ? "Enviando..." : "Enviar sugerencia"}
        </button>
      </div>
    </form>
  );
}
