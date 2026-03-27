import Link from "next/link";
import { cookies } from "next/headers";
import { getEvents, getStats, getVolunteersWithEvents } from "@/lib/queries";
import { createSupabaseServer } from "@/lib/supabase/server";

export default async function AnalyticsPage() {
  const cookieStore = await cookies();
  const activeCommunityId = cookieStore.get("capi-community")?.value ?? undefined;

  const [events, stats, volunteers] = await Promise.all([
    getEvents(true, activeCommunityId),
    getStats(activeCommunityId),
    getVolunteersWithEvents(activeCommunityId),
  ]);
  const upcoming = events.slice(0, 4);

  // Compute real KPIs
  const activeVolunteers = volunteers.filter((v) => v.status === "aprobado").length;
  const totalApplications = volunteers.length;
  const applicationRate = totalApplications > 0 ? Math.round((activeVolunteers / totalApplications) * 100) : 0;

  // Count sponsors
  const supabase = await createSupabaseServer();
  const { count: sponsorCount } = await supabase.from("sponsors").select("id", { count: "exact", head: true });
  const activeSponsors = sponsorCount ?? 0;

  // Events per type for chart
  const typeCount: Record<string, number> = {};
  events.forEach((e) => {
    typeCount[e.type] = (typeCount[e.type] || 0) + 1;
  });

  const chartCategories = [
    { label: "Taller", key: "Taller" },
    { label: "Conferencia", key: "Conferencia" },
    { label: "Charla", key: "Charla" },
    { label: "Programa", key: "Programa" },
    { label: "STEM", key: "Evento STEM" },
    { label: "Voluntariado", key: "Voluntariado Educativo" },
  ];

  const maxCount = Math.max(...chartCategories.map((c) => typeCount[c.key] || 0), 1);

  const statsCards = [
    { icon: "volunteer_activism", bg: "bg-orange-100", color: "text-[#f49d25]", label: "Horas de Voluntariado", value: stats.volunteerHours, trend: `${activeVolunteers} activos`, up: true },
    { icon: "school", bg: "bg-blue-100", color: "text-blue-600", label: "Estudiantes Impactados", value: stats.studentsReached, trend: "objetivo total", up: true },
    { icon: "eco", bg: "bg-emerald-100", color: "text-emerald-600", label: "Instituciones Beneficiadas", value: String(stats.institutionsBenefited), trend: "registradas", up: true },
    { icon: "event_available", bg: "bg-purple-100", color: "text-purple-600", label: "Eventos Registrados", value: String(stats.eventsHosted), trend: "en plataforma", up: true },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-8">
      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-black tracking-tight mb-2 text-slate-900">Impacto Social</h2>
          <p className="text-slate-500">Datos en tiempo real sobre iniciativas sociales y engagement comunitario.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium shadow-sm text-slate-700">
            <span className="material-symbols-outlined text-sm">calendar_month</span>
            Ultimos 30 dias
            <span className="material-symbols-outlined text-sm">expand_more</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#f49d25] text-white rounded-lg text-sm font-bold shadow-lg shadow-[#f49d25]/20">
            <span className="material-symbols-outlined text-sm">download</span>
            Exportar
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((s) => (
          <div key={s.label} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 ${s.bg} ${s.color} rounded-lg`}>
                <span className="material-symbols-outlined">{s.icon}</span>
              </div>
              <span className="text-xs font-bold flex items-center text-emerald-500">
                {s.trend}
              </span>
            </div>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">{s.label}</p>
            <h3 className="text-2xl font-bold mt-1 tracking-tight text-slate-900">{s.value}</h3>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Bar chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h4 className="text-lg font-bold text-slate-900">Eventos por Categoria</h4>
              <p className="text-sm text-slate-500">Distribucion actual de eventos por tipo</p>
            </div>
          </div>
          <div className="h-64 flex gap-6 w-full">
            {chartCategories.map((cat) => {
              const count = typeCount[cat.key] || 0;
              const pct = Math.round((count / maxCount) * 100);
              return (
                <div key={cat.label} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-xs font-bold text-slate-600">{count}</span>
                  <div className="w-full flex justify-center items-end flex-1">
                    <div
                      className="w-3/4 bg-[#f49d25] rounded-t transition-all group-hover:brightness-110"
                      style={{ height: `${Math.max(pct, 5)}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">{cat.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* KPI summary */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-6">KPIs del Producto</h4>
          <div className="space-y-5">
            {[
              { label: "Eventos registrados", value: String(stats.eventsHosted), pct: Math.min(stats.eventsHosted * 5, 100), color: "bg-[#f49d25]" },
              { label: "Voluntarios activos", value: String(activeVolunteers), pct: Math.min(activeVolunteers * 3, 100), color: "bg-blue-500" },
              { label: "Tasa de aprobacion", value: `${applicationRate}%`, pct: applicationRate, color: "bg-purple-500" },
              { label: "Sponsors activos", value: String(activeSponsors), pct: Math.min(activeSponsors * 4, 100), color: "bg-emerald-500" },
            ].map((kpi) => (
              <div key={kpi.label}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-slate-600">{kpi.label}</span>
                  <span className="text-sm font-bold text-slate-900">{kpi.value}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${kpi.color} rounded-full`} style={{ width: `${kpi.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">
            <p className="text-xs text-slate-500 leading-relaxed italic">
              &quot;{activeVolunteers} voluntarios activos de {totalApplications} postulaciones. Tasa de aprobacion: {applicationRate}%.&quot;
            </p>
          </div>
        </div>
      </div>

      {/* Upcoming events + Impact numbers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Impact numbers */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h4 className="text-lg font-bold mb-6 text-slate-900">Metricas de Impacto</h4>
          <div className="grid grid-cols-2 gap-6">
            {[
              { icon: "volunteer_activism", label: "Total Voluntarios", value: stats.totalVolunteers, color: "text-[#f49d25]", bg: "bg-[#f49d25]/10" },
              { icon: "calendar_month", label: "Eventos Realizados", value: String(stats.eventsHosted), color: "text-blue-600", bg: "bg-blue-100" },
              { icon: "school", label: "Estudiantes", value: stats.studentsReached, color: "text-purple-600", bg: "bg-purple-100" },
              { icon: "corporate_fare", label: "Instituciones", value: String(stats.institutionsBenefited), color: "text-emerald-600", bg: "bg-emerald-100" },
            ].map((m) => (
              <div key={m.label} className="flex flex-col gap-2">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${m.bg} ${m.color}`}>
                  <span className="material-symbols-outlined text-sm">{m.icon}</span>
                </div>
                <p className="text-xs text-slate-500 font-medium">{m.label}</p>
                <p className="text-2xl font-black text-slate-900">{m.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming events */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h4 className="text-lg font-bold text-slate-900">Proximos Eventos</h4>
              <p className="text-sm text-slate-500">Oportunidades de alto impacto</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {upcoming.map((event, i) => {
              const colors = ["bg-orange-100 text-[#f49d25]", "bg-blue-100 text-blue-600", "bg-emerald-100 text-emerald-600", "bg-purple-100 text-purple-600"];
              return (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="p-4 flex items-center gap-4 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group"
                >
                  <div className={`size-12 rounded-lg ${colors[i % colors.length]} flex flex-col items-center justify-center border border-current/20`}>
                    <span className="text-[10px] font-bold uppercase">{event.date.split(" ")[1]}</span>
                    <span className="text-lg font-black leading-none">{event.date.split(" ")[0]}</span>
                  </div>
                  <div className="flex-1">
                    <h5 className="font-bold text-sm text-slate-900 group-hover:text-[#f49d25] transition-colors">
                      {event.title}
                    </h5>
                    <p className="text-xs text-slate-500">{event.type} &bull; {event.volunteersNeeded} Voluntarios</p>
                  </div>
                  <span className="material-symbols-outlined text-slate-300 group-hover:text-[#f49d25] text-sm">
                    arrow_forward_ios
                  </span>
                </Link>
              );
            })}
          </div>
          <div className="p-4 border-t border-slate-100 text-center">
            <Link href="/events" className="text-xs font-bold text-slate-500 hover:text-[#f49d25]">
              Ver agenda completa
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
