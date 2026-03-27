import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getEvents, getStats, getPendingApplications, getUserProfile, getUserCommunities, getMyEvents } from "@/lib/queries";
import { getAuthUser } from "@/lib/auth";
import DashboardActions from "./DashboardActions";

export default async function DashboardPage() {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  const [profile, communities] = await Promise.all([
    getUserProfile(user.id),
    getUserCommunities(user.id),
  ]);

  const cookieStore = await cookies();
  const activeCommunityId = cookieStore.get("capi-community")?.value ?? null;
  const activeCommunity = activeCommunityId
    ? communities.find((c) => c.id === activeCommunityId) ?? null
    : null;

  // No active community: personal dashboard
  if (!activeCommunity) {
    const myEvents = await getMyEvents(user.id);
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Bienvenido{profile?.fullName ? `, ${profile.fullName}` : ""}
          </h2>
          <p className="text-slate-500 mt-1">Tu panel personal en Capi.</p>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/dashboard/communities/new"
            className="bg-white p-6 rounded-xl border border-slate-200 hover:border-[#f49d25]/30 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="size-12 bg-[#f49d25]/10 rounded-lg flex items-center justify-center text-[#f49d25]">
                <span className="material-symbols-outlined text-2xl">add_circle</span>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 group-hover:text-[#f49d25] transition-colors">Crear Comunidad</h3>
                <p className="text-sm text-slate-500">Organiza eventos con tu equipo</p>
              </div>
            </div>
          </Link>
          <Link
            href="/events"
            className="bg-white p-6 rounded-xl border border-slate-200 hover:border-[#f49d25]/30 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="size-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                <span className="material-symbols-outlined text-2xl">explore</span>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Explorar Eventos</h3>
                <p className="text-sm text-slate-500">Encuentra oportunidades de voluntariado</p>
              </div>
            </div>
          </Link>
        </div>

        {communities.length > 0 && (
          <section className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-bold text-lg text-slate-900 mb-4">Mis Comunidades</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {communities.map((c) => (
                <Link
                  key={c.id}
                  href={`/dashboard/communities/${c.slug}`}
                  className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:border-[#f49d25]/30 transition-colors"
                >
                  <div className="size-10 bg-[#f49d25]/10 rounded-lg flex items-center justify-center text-[#f49d25]">
                    <span className="material-symbols-outlined">groups</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-slate-900 truncate">{c.name}</p>
                    <p className="text-xs text-slate-500 capitalize">{c.role}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* My events as volunteer */}
        <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-lg text-slate-900">Mis Eventos como Voluntario</h3>
            <Link className="text-[#f49d25] text-sm font-semibold hover:underline" href="/dashboard/my-events">
              Ver todos
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {myEvents.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-sm">
                Aun no te has postulado a ningun evento.
              </div>
            ) : (
              myEvents.slice(0, 5).map((ev) => (
                <Link
                  key={ev.eventVolunteerId}
                  href={`/events/${ev.eventSlug}`}
                  className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-sm text-slate-900">{ev.eventTitle}</p>
                    <p className="text-xs text-slate-500">{ev.role}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    ev.status === "aprobado" ? "bg-emerald-100 text-emerald-700" :
                    ev.status === "rechazado" ? "bg-red-100 text-red-700" :
                    "bg-amber-100 text-amber-700"
                  }`}>
                    {ev.status}
                  </span>
                </Link>
              ))
            )}
          </div>
        </section>
      </div>
    );
  }

  // Active community: community dashboard
  const communityId = activeCommunity.id;
  const [events, stats, applications] = await Promise.all([
    getEvents(true, communityId),
    getStats(communityId),
    getPendingApplications(communityId),
  ]);

  const activeEvents = events.slice(0, 2);

  const metrics = [
    { label: "Eventos Realizados", value: String(stats.eventsHosted), trend: `${stats.eventsHosted} total`, icon: "event_available", color: "text-[#f49d25]", bg: "bg-[#f49d25]/10", bar: "bg-[#f49d25]", pct: `${Math.min(stats.eventsHosted * 10, 100)}%` },
    { label: "Total Voluntarios", value: stats.totalVolunteers, trend: "registrados", icon: "groups", color: "text-blue-600", bg: "bg-blue-100", bar: "bg-blue-500", pct: "85%" },
    { label: "Alcance Total", value: stats.studentsReached, trend: "estudiantes", icon: "public", color: "text-purple-600", bg: "bg-purple-100", bar: "bg-purple-500", pct: "45%" },
    { label: "Horas Voluntariado", value: stats.volunteerHours, trend: "aprobados", icon: "schedule", color: "text-yellow-600", bg: "bg-yellow-100", bar: "bg-yellow-400", pct: `${Math.min(Number(stats.volunteerHours) * 5, 100)}%` },
  ];

  const totalVolunteersNum = parseInt(stats.totalVolunteers.replace(/[^0-9]/g, "")) || 0;
  const studentsReachedNum = parseFloat(stats.studentsReached.replace(/[^0-9.]/g, "")) || 0;
  const studentsActual = stats.studentsReached.includes("k") ? studentsReachedNum * 1000 : studentsReachedNum;
  const engagementPct = totalVolunteersNum > 0 ? Math.min(Math.round((Number(stats.volunteerHours) / totalVolunteersNum) * 100), 100) : 0;
  const impactPct = studentsActual > 0 ? Math.min(Math.round((studentsActual / (studentsActual + 500)) * 100), 100) : 0;
  const awarenessPct = stats.eventsHosted > 0 ? Math.min(Math.round((stats.institutionsBenefited / stats.eventsHosted) * 100), 100) : 0;

  const analytics = [
    { label: "Conciencia Social", pct: awarenessPct, color: "bg-[#f49d25]", textColor: "text-[#f49d25]", bgTag: "bg-[#f49d25]/10" },
    { label: "Engagement Voluntarios", pct: engagementPct, color: "bg-blue-500", textColor: "text-blue-600", bgTag: "bg-blue-100" },
    { label: "Objetivo de Impacto", pct: impactPct, color: "bg-purple-500", textColor: "text-purple-600", bgTag: "bg-purple-100" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">{activeCommunity.name}</h2>
          <p className="text-slate-500 mt-1">Monitorea las iniciativas de impacto social de tu comunidad.</p>
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
              <Link className="text-[#f49d25] text-sm font-semibold hover:underline" href="/dashboard/volunteers">Ver todas</Link>
            </div>
            <div className="divide-y divide-slate-100">
              {applications.length === 0 && (
                <div className="p-6 text-center text-slate-400 text-sm">
                  No hay postulaciones pendientes.
                </div>
              )}
              {applications.map((app) => (
                <div
                  key={app.id}
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
                  <DashboardActions applicationId={app.id} />
                </div>
              ))}
            </div>
          </section>

          {/* Active Events */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-slate-900">Resumen de Eventos Activos</h3>
              <Link href="/dashboard/events" className="text-[#f49d25] text-sm font-semibold hover:underline">
                Ver todos
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeEvents.map((event) => {
                const pct = Math.round((event.volunteersJoined / event.volunteersNeeded) * 100);
                return (
                  <div key={event.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col">
                    <div className="h-32 relative overflow-hidden bg-slate-100">
                      {event.image ? (
                        <Image src={event.image} alt={event.title} fill sizes="(max-width: 768px) 100vw, 300px" className="object-cover" />
                      ) : (
                        <div className="h-32 flex items-center justify-center text-slate-300">
                          <span className="material-symbols-outlined text-3xl">image</span>
                        </div>
                      )}
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
                            +{Math.max(event.volunteersJoined - 3, 0)}
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
            <h3 className="font-bold text-lg mb-6 text-slate-900">Analiticas de Alcance</h3>
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
          </section>

          {/* Quick Links */}
          <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-lg mb-4 text-slate-900">Acciones Rapidas</h3>
            <div className="space-y-2">
              {[
                { label: "Ver analiticas completas", href: "/dashboard/analytics", icon: "analytics" },
                { label: "Explorar todos los eventos", href: "/events", icon: "calendar_today" },
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
