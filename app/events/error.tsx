"use client";

import Link from "next/link";

export default function EventsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f7f5] px-4" role="alert">
      <div className="text-center space-y-4 max-w-md">
        <div className="size-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-3xl text-red-600" aria-hidden="true">error</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900">Error al cargar eventos</h2>
        <p className="text-sm text-slate-500">
          {error.message || "No pudimos cargar los eventos. Por favor, intenta de nuevo."}
        </p>
        {error.digest && (
          <p className="text-xs text-slate-400">Error ID: {error.digest}</p>
        )}
        <div className="flex gap-3 justify-center pt-2">
          <button
            onClick={reset}
            className="px-6 py-2.5 rounded-xl bg-[#f49d25] text-white font-bold text-sm hover:brightness-105 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f49d25] disabled:cursor-not-allowed"
          >
            Reintentar
          </button>
          <Link
            href="/"
            className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f49d25]"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
