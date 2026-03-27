"use client";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="p-8 flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4 max-w-md">
        <div className="size-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-3xl text-red-600">error</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900">Algo salió mal</h2>
        <p className="text-sm text-slate-500">{error.message || "Ocurrió un error inesperado."}</p>
        <button
          onClick={reset}
          className="px-6 py-2.5 rounded-xl bg-[#f49d25] text-white font-bold text-sm hover:brightness-105 transition-all"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}
