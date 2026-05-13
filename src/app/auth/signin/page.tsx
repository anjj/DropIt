import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SignInButton } from "@/components/ui/SignInButton";

export default async function SignInPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/");

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4">
      <div className="card w-full max-w-sm text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-brand-600 text-white text-xl font-bold mb-4">
            D
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Acceder a DropIt</h1>
          <p className="text-sm text-gray-500 mt-1">
            Utiliza tu cuenta corporativa de Microsoft para continuar.
          </p>
        </div>

        <SignInButton />

        <p className="mt-4 text-xs text-gray-400">
          Solo cuentas autorizadas de la organización pueden acceder.
        </p>
      </div>
    </div>
  );
}
