"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface UploadedFile {
  key: string;
  name: string;
  size: number;
}

interface FileUploadProps {
  onUpload: (files: UploadedFile[]) => void;
}

export function FileUpload({ onUpload }: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (accepted: File[]) => {
      if (!accepted.length) return;
      setError(null);
      setUploading(true);

      try {
        const uploaded: UploadedFile[] = [];

        for (const file of accepted) {
          const presignRes = await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ filename: file.name, contentType: file.type, size: file.size }),
          });

          if (!presignRes.ok) throw new Error("Error al obtener URL de carga");
          const { url, key } = await presignRes.json();

          await fetch(url, {
            method: "PUT",
            body: file,
            headers: { "Content-Type": file.type },
          });

          uploaded.push({ key, name: file.name, size: file.size });
        }

        const next = [...files, ...uploaded];
        setFiles(next);
        onUpload(next);
      } catch {
        setError("Error al subir archivos. Inténtalo de nuevo.");
      } finally {
        setUploading(false);
      }
    },
    [files, onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 10 * 1024 * 1024,
    accept: {
      "image/*": [],
      "application/pdf": [],
      "application/msword": [],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [],
    },
  });

  function removeFile(key: string) {
    const next = files.filter((f) => f.key !== key);
    setFiles(next);
    onUpload(next);
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={`rounded-lg border-2 border-dashed px-4 py-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-brand-400 bg-brand-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <p className="text-sm text-gray-500">Subiendo archivos...</p>
        ) : (
          <>
            <p className="text-sm text-gray-600">
              Arrastra archivos aquí o{" "}
              <span className="text-brand-600 font-medium">haz clic para seleccionar</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Imágenes, PDF, Word · Máx. 10 MB por archivo
            </p>
          </>
        )}
      </div>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

      {files.length > 0 && (
        <ul className="mt-3 space-y-1">
          {files.map((f) => (
            <li key={f.key} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm">
              <span className="truncate text-gray-700">{f.name}</span>
              <button
                type="button"
                onClick={() => removeFile(f.key)}
                className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
