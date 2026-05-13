"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-gray-900">
          <span className="rounded-lg bg-brand-600 px-2 py-0.5 text-white text-sm font-semibold">
            Drop
          </span>
          It
        </Link>

        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Link href="/explore" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Explorar
              </Link>
              <Link href="/feedback/new" className="btn-primary text-sm">
                + Nueva idea
              </Link>
              <div className="relative group">
                <button className="flex items-center gap-2 rounded-full">
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name ?? ""}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-brand-700 text-sm font-medium">
                      {session.user?.name?.[0]?.toUpperCase() ?? "U"}
                    </span>
                  )}
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <p className="px-4 py-2 text-sm font-medium text-gray-900 truncate">
                    {session.user?.name}
                  </p>
                  <p className="px-4 pb-2 text-xs text-gray-500 truncate">
                    {session.user?.email}
                  </p>
                  <hr className="border-gray-100 mb-1" />
                  <button
                    onClick={() => signOut()}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Cerrar sesión
                  </button>
                </div>
              </div>
            </>
          ) : (
            <button
              onClick={() => signIn("azure-ad")}
              className="btn-primary text-sm"
            >
              Iniciar sesión
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
