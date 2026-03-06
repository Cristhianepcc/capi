import Link from "next/link";
import Image from "next/image";
import { events } from "@/lib/data";

const metrics = [
  { label: "Eventos Activos", value: "12", trend: "+2%", icon: "event_available", color: "text-[#f49d25]", bg: "bg-[#f49d25]/10", bar: "bg-[#f49d25]", pct: "66%" },
  { label: "Total Voluntarios", value: "458", trend: "+15%", icon: "groups", color: "text-blue-600", bg: "bg-blue-100", bar: "bg-blue-500", pct: "85%" },
  { label: "Alcance Total", value: "15.2k", trend: "+8%", icon: "public", color: "text-purple-600", bg: "bg-purple-100", bar: "bg-purple-500", pct: "45%" },
  { label: "Rating Comunidad", value: "4.9", trend: "/ 5.0", icon: "star", color: "text-yellow-600", bg: "bg-yellow-100", bar: "bg-yellow-400", pct: "98%" },
];

const applications = [
  { name: "María García", event: "Taller STEM para Niños", initials: "MG", color: "bg-amber-400" },
  { name: "Carlos Quispe", event: "Liderazgo Juvenil 2024", initials: "CQ", color: "bg-blue-400" },
  { name: "Ana Torres", event: "Formación Digital", initials: "AT", color: "bg-purple-400" },
];

const analytics = [
  { label: "Conciencia Social", pct: 70, color: "bg-[#f49d25]", textColor: "text-[#f49d25]", bgTag: "bg-[#f49d25]/10" },
  { label: "Engagement Voluntarios", pct: 85, color: "bg-blue-500", textColor: "text-blue-600", bgTag: "bg-blue-100" },
  { label: "Objetivo de Impacto", pct: 42, color: "bg-purple-500", textColor: "text-purple-600", bgTag: "bg-purple-100" },
];

export default function DashboardPage() {
  const activeEvents = events.slice(0, 2);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Dashboard Overview</h2>
          <p className="text-slate-500 mt-1">Monitorea tus iniciativas de impacto social y crecimiento comunitario.</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-slate-500 bg-white px-4 py-2 rounded-lg border border-slate-200">
          <span className="material-symbols-outlined text-sm">calendar_month</span>
          Octubre 2024 - Presente
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m) => (
          <div key={m.label} className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 text-sm font-medium">{m.label}</span>
              <span className={`p-2 ${m.bg} ${m.color} rounded-lg material-symbols-outlined`}>{m.icon}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">{m.value}</span>
              <span className="text-green-600 text-xs font-bold">{m.trend}</span>
            </div>
            <div className="w-full bg-slate-100 h-1 rounded-full mt-2 overflow-hidden">
              <div className={`${m.bar} h-full rounded-full`} style={{ width: m.pct }} />
            </div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Pending Applications */}
          <section className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900">Postulaciones Pendientes</h3>
              <a className="text-[#f49d25] text-sm font-semibold hover:underline" href="#">Ver todas</a>
            </div>
            <div className="divide-y divide-slate-100">
              {applications.map((app) => (
                <div
                  key={app.name}
                  className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`size-12 rounded-lg ${app.color} flex items-center justify-center text-white font-bold`}>
                      {app.initials}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{app.name}</h4>
                      <p className="text-xs text-slate-500">
                        Postula a:{" "}
                        <span className="text-[#f49d25] font-medium">{app.event}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-[#f49d25]/10 text-[#f49d25] hover:bg-[#f49d25] hover:text-white rounded-lg text-sm font-bold transition-all">
                      Aprobar
                    </button>
                    <button className="px-4 py-2 bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg text-sm font-bold transition-all">
                      Rechazar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Active Events */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-slate-900">Resumen de Eventos Activos</h3>
              <Link href="/events" className="text-[#f49d25] text-sm font-semibold hover:underline">
                Ver todos
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeEvents.map((event) => {
                const pct = Math.round((event.volunteersJoined / event.volunteersNeeded) * 100);
                return (
                  <div key={event.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col">
                    <div className="h-32 relative overflow-hidden bg-slate-100">
                      <Image src={event.image} alt={event.title} fill sizes="(max-width: 768px) 100vw, 300px" className="object-cover" />
                      <div className="absolute top-2 right-2 px-2 py-1 bg-[#f49d25] text-white text-[10px] font-bold uppercase rounded">
                        Activo
                      </div>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h4 className="font-bold text-base mb-1 text-slate-900">{event.title}</h4>
                      <p className="text-xs text-slate-500 mb-4 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">location_on</span>
                        {event.location}
                      </p>
                      <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                        <div className="flex -space-x-2">
                          {["bg-slate-300", "bg-slate-400", "bg-slate-500"].map((c, i) => (
                            <div key={i} className={`size-6 rounded-full border-2 border-white ${c}`} />
                          ))}
                          <div className="size-6 rounded-full border-2 border-white bg-[#f49d25] flex items-center justify-center text-[10px] text-white font-bold">
                            +{event.volunteersJoined - 3}
                          </div>
                        </div>
                        <span className="text-xs font-bold text-slate-600">{pct}% Capacidad</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Right column */}
        <div className="space-y-8">
          {/* Analytics Widget */}
          <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-lg mb-6 text-slate-900">Analíticas de Alcance</h3>
            <div className="space-y-6">
              {analytics.map((a) => (
                <div key={a.label} className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-semibold py-1 px-2 uppercase rounded-full ${a.textColor} ${a.bgTag}`}>
                      {a.label}
                    </span>
                    <span className={`text-xs font-semibold ${a.textColor}`}>{a.pct}%</span>
                  </div>
                  <div className="overflow-hidden h-2 rounded bg-slate-100">
                    <div className={`${a.color} h-full`} style={{ width: `${a.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">
              <p className="text-xs text-slate-500 leading-relaxed italic">
                &quot;El engagement aumentó un 12% respecto al mes anterior. Considera lanzar un nuevo taller para mantener el impulso.&quot;
              </p>
            </div>
          </section>

          {/* Quick Links */}
          <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-lg mb-4 text-slate-900">Acciones Rápidas</h3>
            <div className="space-y-2">
              {[
                { label: "Ver analíticas completas", href: "/dashboard/analytics", icon: "analytics" },
                { label: "Explorar todos los eventos", href: "/events", icon: "calendar_today" },
                { label: "Ver evento destacado", href: "/events/stem-workshop-kids", icon: "star" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#f49d25]/5 hover:text-[#f49d25] transition-colors text-slate-600 group"
                >
                  <span className="material-symbols-outlined text-sm">{link.icon}</span>
                  <span className="text-sm font-medium">{link.label}</span>
                  <span className="material-symbols-outlined text-sm ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                    arrow_forward_ios
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
