import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4 text-center">
      <div className="max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700 mb-6">
          <span className="h-2 w-2 rounded-full bg-brand-500" />
          Portal de Feedback
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
          Tu opinión impulsa{" "}
          <span className="text-brand-600">el cambio</span>
        </h1>

        <p className="text-lg text-gray-600 mb-10">
          Comparte ideas, vota por las mejoras que necesitas y ayuda a priorizar
          el desarrollo de nuestros productos.
        </p>

        {session ? (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/feedback/new" className="btn-primary text-base px-6 py-3">
              Enviar sugerencia
            </Link>
            <Link href="/explore" className="btn-secondary text-base px-6 py-3">
              Explorar ideas
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <Link href="/api/auth/signin" className="btn-primary text-base px-6 py-3">
              Iniciar sesión con Microsoft
            </Link>
            <p className="text-sm text-gray-500">
              Acceso exclusivo con cuenta corporativa de Azure AD
            </p>
          </div>
        )}

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <div className="card">
            <div className="text-2xl mb-3">💡</div>
            <h3 className="font-semibold text-gray-900 mb-1">Sugiere mejoras</h3>
            <p className="text-sm text-gray-600">
              Describe la funcionalidad que necesitas con texto enriquecido y archivos adjuntos.
            </p>
          </div>
          <div className="card">
            <div className="text-2xl mb-3">🔍</div>
            <h3 className="font-semibold text-gray-900 mb-1">Sin duplicados</h3>
            <p className="text-sm text-gray-600">
              El sistema detecta peticiones similares en tiempo real para mantener el feedback organizado.
            </p>
          </div>
          <div className="card">
            <div className="text-2xl mb-3">👆</div>
            <h3 className="font-semibold text-gray-900 mb-1">Vota por ideas</h3>
            <p className="text-sm text-gray-600">
              Apoya las propuestas que más te importan para ayudar a priorizar el desarrollo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
