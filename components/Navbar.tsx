"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createSupabaseBrowser();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    const supabase = createSupabaseBrowser();
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
    router.refresh();
  }

  const isLoggedIn = !loading && user !== null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#f49d25]/10 bg-[#f8f7f5]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-[#f49d25]">
          <span className="material-symbols-outlined text-3xl">volunteer_activism</span>
          <span className="text-xl font-extrabold tracking-tight text-slate-900">Capi</span>
        </Link>

        {/* Nav links (desktop) */}
        <nav className="hidden flex-1 justify-center gap-8 lg:flex">
          <Link href="/events" className="text-sm font-semibold text-slate-700 hover:text-[#f49d25] transition-colors">
            Eventos
          </Link>
          <Link href="/communities" className="text-sm font-semibold text-slate-700 hover:text-[#f49d25] transition-colors">
            Comunidades
          </Link>
          <Link href="/#impacto" className="text-sm font-semibold text-slate-700 hover:text-[#f49d25] transition-colors">
            Impacto
          </Link>
        </nav>

        {/* CTA buttons (desktop) */}
        <div className="hidden lg:flex items-center gap-3">
          {loading ? (
            <div className="w-24 h-9" />
          ) : isLoggedIn ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-lg bg-[#f49d25]/10 px-4 py-2 text-sm font-bold text-[#f49d25] hover:bg-[#f49d25]/20 transition-all"
              >
                <span className="material-symbols-outlined text-sm">dashboard</span>
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all"
              >
                <span className="material-symbols-outlined text-sm">logout</span>
                Salir
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center justify-center rounded-lg bg-[#f49d25]/10 px-4 py-2 text-sm font-bold text-[#f49d25] hover:bg-[#f49d25]/20 transition-all"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/events"
                className="flex items-center justify-center rounded-lg bg-[#f49d25] px-5 py-2 text-sm font-bold text-white shadow-lg shadow-[#f49d25]/20 hover:brightness-105 active:scale-95 transition-all"
              >
                Ver Eventos
              </Link>
            </>
          )}
        </div>

        {/* Hamburger button (mobile) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <span className="material-symbols-outlined">{menuOpen ? "close" : "menu"}</span>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <>
          <div className="fixed inset-0 top-[73px] bg-black/20 z-40 lg:hidden" onClick={() => setMenuOpen(false)} />
          <div className="absolute top-full left-0 right-0 bg-[#f8f7f5] border-b border-[#f49d25]/10 shadow-lg z-50 lg:hidden">
            <nav className="flex flex-col p-6 gap-4">
              <Link
                href="/events"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-semibold text-slate-700 hover:text-[#f49d25] transition-colors py-2"
              >
                Eventos
              </Link>
              <Link
                href="/communities"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-semibold text-slate-700 hover:text-[#f49d25] transition-colors py-2"
              >
                Comunidades
              </Link>
              <Link
                href="/#impacto"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-semibold text-slate-700 hover:text-[#f49d25] transition-colors py-2"
              >
                Impacto
              </Link>
              <div className="border-t border-slate-200 pt-4 flex flex-col gap-3">
                {isLoggedIn ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-center gap-2 rounded-lg bg-[#f49d25]/10 px-4 py-2.5 text-sm font-bold text-[#f49d25]"
                    >
                      <span className="material-symbols-outlined text-sm">dashboard</span>
                      Dashboard
                    </Link>
                    <button
                      onClick={() => { setMenuOpen(false); handleLogout(); }}
                      className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600"
                    >
                      <span className="material-symbols-outlined text-sm">logout</span>
                      Cerrar sesión
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-center rounded-lg bg-[#f49d25]/10 px-4 py-2.5 text-sm font-bold text-[#f49d25]"
                    >
                      Iniciar sesión
                    </Link>
                    <Link
                      href="/events"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-center rounded-lg bg-[#f49d25] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#f49d25]/20"
                    >
                      Ver Eventos
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
