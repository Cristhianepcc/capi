import Link from "next/link";
import SidebarNav from "@/components/SidebarNav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f8f7f5]">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-[#f49d25]/10 bg-white flex flex-col justify-between p-4">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-3 px-2">
            <div className="size-10 bg-[#f49d25] rounded-lg flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-2xl">volunteer_activism</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-slate-900 text-base font-bold leading-tight">Capi</h1>
              <p className="text-[#f49d25] text-xs font-medium uppercase tracking-wider">Consola Organizador</p>
            </div>
          </div>
          <SidebarNav />
        </div>

        <div className="flex flex-col gap-4">
          <Link
            href="/dashboard/events/new"
            className="w-full bg-[#f49d25] hover:bg-[#f49d25]/90 text-white rounded-lg py-3 flex items-center justify-center gap-2 font-bold text-sm shadow-lg shadow-[#f49d25]/20 transition-all"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Crear Evento
          </Link>
          <div className="flex items-center gap-3 p-2 border-t border-slate-100 pt-4">
            <div className="size-10 rounded-full bg-[#f49d25]/20 flex items-center justify-center text-[#f49d25] font-bold text-sm border border-[#f49d25]/30">
              AR
            </div>
            <div className="flex flex-col overflow-hidden flex-1">
              <p className="text-sm font-semibold truncate text-slate-900">Alex Rivera</p>
              <p className="text-xs text-slate-500 truncate">Organizador Principal</p>
            </div>
            <span className="material-symbols-outlined text-slate-400 cursor-pointer">settings</span>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f49d25]/50"
                placeholder="Buscar eventos, voluntarios..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="size-10 flex items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:text-[#f49d25] transition-colors relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-[#f49d25]" />
            </button>
            <button className="px-4 py-2 bg-slate-100 text-slate-900 rounded-lg text-sm font-semibold flex items-center gap-2 border border-slate-200">
              <span className="material-symbols-outlined text-sm">download</span>
              Exportar
            </button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
