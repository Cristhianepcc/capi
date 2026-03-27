import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";
import { getEvents, getStats, getPublicCommunities } from "@/lib/queries";

export default async function HomePage() {
  const [events, stats, communities] = await Promise.all([getEvents(), getStats(), getPublicCommunities()]);
  const featuredEvents = events.slice(0, 3);

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-[#f8f7f5]">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-10 lg:py-16">

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
          <div className="flex flex-col gap-8 order-2 lg:order-1">
            <div className="flex flex-col gap-4">
              <span className="inline-flex w-fit items-center rounded-full bg-[#f49d25]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#f49d25]">
                La Plataforma #1 de Voluntariado
              </span>
              <h1 className="text-4xl font-black leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Empoderando comunidades a través de{" "}
                <span className="text-[#f49d25]">eventos de impacto</span>
              </h1>
              <p className="text-lg leading-relaxed text-slate-600">
                Organiza, gestiona y escala tus iniciativas sin fines de lucro con Capi.
                La plataforma todo-en-uno para quienes crean cambio social.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/dashboard/events/new"
                className="group flex h-14 items-center justify-center gap-2 rounded-xl bg-[#f49d25] px-8 font-bold text-white shadow-xl shadow-[#f49d25]/30 transition-all hover:-translate-y-0.5"
              >
                <span>Organizar un Evento</span>
                <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </Link>
              <Link
                href="/events"
                className="flex h-14 items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-transparent px-8 font-bold text-slate-900 transition-all hover:bg-slate-50"
              >
                <span className="material-symbols-outlined text-xl">group</span>
                Ser Voluntario
              </Link>
            </div>

            <div className="flex items-center gap-4 border-t border-slate-100 pt-8">
              <div className="flex -space-x-3">
                {["bg-amber-400", "bg-orange-400", "bg-yellow-500"].map((c, i) => (
                  <div key={i} className={`h-10 w-10 rounded-full border-2 border-white ${c}`} />
                ))}
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[#f49d25] text-[10px] font-bold text-white">
                  {stats.totalVolunteers}
                </div>
              </div>
              <p className="text-sm font-medium text-slate-600">
                Con la confianza de {stats.institutionsBenefited}+ instituciones aliadas
              </p>
            </div>
          </div>

          <div className="relative order-1 lg:order-2">
            <div className="absolute -inset-4 rounded-3xl bg-[#f49d25]/10 blur-2xl" />
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border-4 border-white bg-slate-100 shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80"
                alt="Voluntarios trabajando juntos"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute bottom-6 -left-6 hidden rounded-2xl bg-white p-4 shadow-xl sm:flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                <span className="material-symbols-outlined">trending_up</span>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Impacto Social</p>
                <p className="text-xl font-black text-slate-900">{stats.studentsReached} estudiantes</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats ────────────────────────────────────────────────── */}
        <section className="mt-20 flex flex-wrap gap-6" id="impacto">
          {[
            { icon: "groups", label: "Total Voluntarios", value: stats.totalVolunteers },
            { icon: "calendar_month", label: "Eventos Realizados", value: String(stats.eventsHosted) },
            { icon: "school", label: "Estudiantes Impactados", value: stats.studentsReached },
          ].map((stat) => (
            <div
              key={stat.label}
              className="group flex min-w-[240px] flex-1 flex-col gap-3 rounded-2xl border border-[#f49d25]/10 bg-white p-8 transition-all hover:border-[#f49d25]/30 hover:shadow-xl"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f49d25]/10 text-[#f49d25] transition-transform group-hover:scale-110">
                <span className="material-symbols-outlined">{stat.icon}</span>
              </div>
              <p className="text-lg font-semibold text-slate-600">{stat.label}</p>
              <p className="text-4xl font-black tracking-tight text-slate-900">{stat.value}</p>
            </div>
          ))}
        </section>

        {/* ── Featured Events ───────────────────────────────────────── */}
        <section className="mt-24" id="eventos">
          <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-xl">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Próximos Eventos Destacados
              </h2>
              <p className="mt-2 text-slate-600">
                Únete a un movimiento cerca de ti. Explora nuestros talleres y charlas más destacados.
              </p>
            </div>
            <Link href="/events" className="group flex items-center gap-1 font-bold text-[#f49d25]">
              Ver todos los eventos
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">chevron_right</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>

        {/* ── Comunidades ──────────────────────────────────────────── */}
        {communities.length > 0 && (
          <section className="mt-24" id="comunidades">
            <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div className="max-w-xl">
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                  Nuestras Comunidades
                </h2>
                <p className="mt-2 text-slate-600">
                  Conoce a los grupos que organizan eventos de impacto social a traves de Capi.
                </p>
              </div>
              <Link href="/communities" className="group flex items-center gap-1 font-bold text-[#f49d25]">
                Ver todas
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">chevron_right</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {communities.slice(0, 6).map((community) => (
                <Link
                  key={community.id}
                  href={`/communities/${community.slug}`}
                  className="group flex items-start gap-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:border-[#f49d25]/20"
                >
                  <div className="size-14 bg-[#f49d25]/10 rounded-xl flex items-center justify-center text-[#f49d25] flex-shrink-0 transition-transform group-hover:scale-110">
                    <span className="material-symbols-outlined text-3xl">groups</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#f49d25] transition-colors truncate">
                      {community.name}
                    </h3>
                    {community.description && (
                      <p className="text-sm text-slate-500 mt-1 line-clamp-2">{community.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-3 text-xs text-slate-400 font-medium">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">person</span>
                        {community.membersCount} miembros
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">event</span>
                        {community.eventsCount} eventos
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── CTA Banner ────────────────────────────────────────────── */}
        <section className="mt-24 rounded-3xl bg-[#f49d25] px-8 py-16 text-center text-white lg:px-16">
          <h2 className="text-3xl font-black sm:text-4xl lg:text-5xl">¿Listo para hacer la diferencia?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg font-medium opacity-90">
            Únete a nuestra comunidad de organizadores y voluntarios que están construyendo un futuro mejor juntos.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/events"
              className="rounded-xl bg-white px-8 py-4 font-black text-[#f49d25] transition-all hover:scale-105 active:scale-95"
            >
              Explorar Eventos
            </Link>
            <Link
              href="/login"
              className="rounded-xl border-2 border-white/30 px-8 py-4 font-black text-white backdrop-blur-sm transition-all hover:bg-white/10 active:scale-95"
            >
              Iniciar sesión
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
