import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-2 gap-12 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 flex flex-col gap-4 lg:col-span-2">
            <div className="flex items-center gap-2 text-[#f49d25]">
              <span className="material-symbols-outlined text-2xl font-bold">volunteer_activism</span>
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Capi</h2>
            </div>
            <p className="max-w-xs text-sm text-slate-500">
              La plataforma líder para gestión de eventos sin fines de lucro y movilización de voluntarios.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-900">Plataforma</h4>
            <ul className="flex flex-col gap-2 text-sm text-slate-500">
              <li><Link href="/events" className="hover:text-[#f49d25] transition-colors">Eventos</Link></li>
              <li><Link href="/communities" className="hover:text-[#f49d25] transition-colors">Comunidades</Link></li>
              <li><Link href="/dashboard" className="hover:text-[#f49d25] transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-900">Empresa</h4>
            <ul className="flex flex-col gap-2 text-sm text-slate-500">
              <li><Link href="/#nosotros" className="hover:text-[#f49d25] transition-colors">Nosotros</Link></li>
              <li><Link href="/events" className="hover:text-[#f49d25] transition-colors">Blog</Link></li>
              <li><Link href="/dashboard/institutions" className="hover:text-[#f49d25] transition-colors">Aliados</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-900">Soporte</h4>
            <ul className="flex flex-col gap-2 text-sm text-slate-500">
              <li><a href="mailto:soporte@capi.dev" className="hover:text-[#f49d25] transition-colors">Centro de ayuda</a></li>
              <li><Link href="/terms" className="hover:text-[#f49d25] transition-colors">Términos</Link></li>
              <li><Link href="/privacy" className="hover:text-[#f49d25] transition-colors">Privacidad</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} Capi. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
