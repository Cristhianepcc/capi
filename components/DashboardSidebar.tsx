"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SidebarNav from "@/components/SidebarNav";
import CommunitySwitcher from "@/components/CommunitySwitcher";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { useCommunity } from "@/lib/communityContext";

export default function DashboardSidebar() {
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userInitials, setUserInitials] = useState("");
  const router = useRouter();
  const { activeCommunity, isSystemAdmin } = useCommunity();

  useEffect(() => {
    const supabase = createSupabaseBrowser();
    supabase.auth.getUser().then(({ data }) => {
      const user = data.user;
      if (!user) return;
      const fullName = user.user_metadata?.full_name as string | undefined;
      if (fullName) {
        setUserName(fullName);
        const initials = fullName
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();
        setUserInitials(initials);
      } else {
        const email = user.email ?? "";
        setUserName(email);
        setUserInitials(email.slice(0, 2).toUpperCase());
      }
    });
  }, []);

  async function handleSignOut() {
    const supabase = createSupabaseBrowser();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const consoleLabel = activeCommunity
    ? activeCommunity.name
    : "Panel Personal";

  const canCreateEvent = activeCommunity && (activeCommunity.role === "lider" || activeCommunity.role === "admin");

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-30 size-10 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 shadow-sm hover:text-[#f49d25] transition-colors"
        aria-label="Abrir menu de navegacion"
      >
        <span className="material-symbols-outlined">menu</span>
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 flex-shrink-0 border-r border-[#f49d25]/10 bg-white flex flex-col justify-between p-4 transform transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3 px-2 hover:opacity-80 transition-opacity">
              <div className="size-10 bg-[#f49d25] rounded-lg flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-2xl">volunteer_activism</span>
              </div>
              <div className="flex flex-col">
                <h1 className="text-slate-900 text-base font-bold leading-tight">Capi</h1>
                <p className="text-[#f49d25] text-[10px] font-medium uppercase tracking-wider truncate max-w-[120px]">{consoleLabel}</p>
              </div>
            </Link>
            <button
              onClick={() => setOpen(false)}
              className="lg:hidden p-1 rounded-lg text-slate-400 hover:text-slate-600"
              aria-label="Cerrar menu de navegacion"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>

          {/* Community switcher */}
          <CommunitySwitcher />

          <div onClick={() => setOpen(false)}>
            <SidebarNav />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="w-full border border-slate-200 text-slate-600 hover:text-[#f49d25] hover:border-[#f49d25]/30 rounded-lg py-2.5 flex items-center justify-center gap-2 font-semibold text-sm transition-all"
          >
            <span className="material-symbols-outlined text-sm">open_in_new</span>
            Ver sitio
          </Link>
          {canCreateEvent && (
            <Link
              href="/dashboard/events/new"
              onClick={() => setOpen(false)}
              className="w-full bg-[#f49d25] hover:bg-[#f49d25]/90 text-white rounded-lg py-3 flex items-center justify-center gap-2 font-bold text-sm shadow-lg shadow-[#f49d25]/20 transition-all"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Crear Evento
            </Link>
          )}
          <div className="flex items-center gap-3 p-2 border-t border-slate-100 pt-4">
            <div className="size-10 rounded-full bg-[#f49d25]/20 flex items-center justify-center text-[#f49d25] font-bold text-sm border border-[#f49d25]/30">
              {userInitials || ".."}
            </div>
            <div className="flex flex-col overflow-hidden flex-1">
              <p className="text-sm font-semibold truncate text-slate-900">{userName || "Cargando..."}</p>
              <p className="text-xs text-slate-500 truncate">
                {isSystemAdmin ? "Administrador" : "Usuario"}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="material-symbols-outlined text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
              title="Cerrar sesion"
              aria-label="Cerrar sesion"
            >
              logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
