import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#f49d25]/10 bg-[#f8f7f5]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-[#f49d25]">
          <span className="material-symbols-outlined text-3xl">volunteer_activism</span>
          <span className="text-xl font-extrabold tracking-tight text-slate-900">Capi</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden flex-1 justify-center gap-8 lg:flex">
          <Link href="/events" className="text-sm font-semibold text-slate-700 hover:text-[#f49d25] transition-colors">
            Eventos
          </Link>
          <Link href="/#como-funciona" className="text-sm font-semibold text-slate-700 hover:text-[#f49d25] transition-colors">
            Cómo funciona
          </Link>
          <Link href="/#impacto" className="text-sm font-semibold text-slate-700 hover:text-[#f49d25] transition-colors">
            Impacto
          </Link>
          <Link href="/#roles" className="text-sm font-semibold text-slate-700 hover:text-[#f49d25] transition-colors">
            Roles
          </Link>
        </nav>

        {/* CTA buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="hidden sm:flex items-center justify-center rounded-lg bg-[#f49d25]/10 px-4 py-2 text-sm font-bold text-[#f49d25] hover:bg-[#f49d25]/20 transition-all"
          >
            Dashboard
          </Link>
          <Link
            href="/events"
            className="flex items-center justify-center rounded-lg bg-[#f49d25] px-5 py-2 text-sm font-bold text-white shadow-lg shadow-[#f49d25]/20 hover:brightness-105 active:scale-95 transition-all"
          >
            Ver Eventos
          </Link>
        </div>
      </div>
    </header>
  );
}
