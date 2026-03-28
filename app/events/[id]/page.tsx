import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ShareButton from "@/components/ShareButton";
import { getEvents } from "@/lib/queries";
import { getAuthUser } from "@/lib/auth";
import ReviewForm from "./ReviewForm";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [events, user] = await Promise.all([getEvents(), getAuthUser()]);
  const event = events.find((e) => e.id === id);
  if (!event) notFound();

  const pct = Math.round((event.volunteersJoined / event.volunteersNeeded) * 100);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f7f5]">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-6 lg:px-20 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#f49d25]/20 px-4 py-1 text-[#f49d25] text-xs font-bold uppercase tracking-wider">
                  <span className="material-symbols-outlined text-sm" aria-hidden="true">calendar_today</span>
                  {event.date} - {event.location}
                </div>
                {event.status === "finalizado" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-3 py-1 text-slate-600 text-xs font-bold uppercase tracking-wider">
                    <span className="material-symbols-outlined text-sm" aria-hidden="true">check_circle</span>
                    Finalizado
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-black leading-tight tracking-tight lg:text-5xl text-slate-900">
                {event.title.split(" ").slice(0, -1).join(" ")}{" "}
                <span className="text-[#f49d25]">{event.title.split(" ").slice(-1)}</span>
              </h1>
              <p className="text-lg text-slate-600">{event.description}</p>
              {event.communityName && (
                <p className="text-sm text-slate-500 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-[#f49d25]" aria-hidden="true">groups</span>
                  Organizado por{" "}
                  {event.communitySlug ? (
                    <Link href={`/communities/${event.communitySlug}`} className="font-semibold text-[#f49d25] hover:underline">
                      {event.communityName}
                    </Link>
                  ) : (
                    <span className="font-semibold text-slate-700">{event.communityName}</span>
                  )}
                </p>
              )}

              <div className="flex flex-wrap gap-4">
                <ShareButton title={event.title} url={`/events/${event.id}`} />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <div className="flex -space-x-3">
                  {["bg-amber-400", "bg-orange-400", "bg-yellow-500"].map((c, i) => (
                    <div key={i} className={`size-10 rounded-full border-2 border-[#f8f7f5] ${c}`} />
                  ))}
                  <div className="flex size-10 items-center justify-center rounded-full border-2 border-[#f8f7f5] bg-slate-200 text-xs font-bold text-slate-600">
                    +{Math.max(0, event.volunteersJoined - 3)}
                  </div>
                </div>
                <p className="text-sm font-medium text-slate-500">Ya se unieron a la causa</p>
              </div>
            </div>

            <div className="relative">
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl">
                {event.image ? (
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-slate-300">
                    <span className="material-symbols-outlined text-6xl" aria-hidden="true">image</span>
                  </div>
                )}
              </div>
              <div className="mt-4 sm:mt-0 sm:absolute sm:-bottom-6 sm:-left-6 rounded-2xl bg-white p-4 sm:p-6 shadow-xl border border-[#f49d25]/10">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-[#f49d25]/10 p-3 text-[#f49d25]">
                    <span className="material-symbols-outlined text-3xl" aria-hidden="true">location_on</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-400">Ubicación</p>
                    <p className="font-bold text-slate-900">{event.location}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-[#f49d25]/5 py-12">
          <div className="mx-auto max-w-7xl px-6 lg:px-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="rounded-2xl bg-[#f8f7f5] p-8 shadow-sm border border-[#f49d25]/10">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-bold uppercase tracking-wider text-slate-500">Voluntarios Necesarios</p>
                  <span className="material-symbols-outlined text-[#f49d25]" aria-hidden="true">groups</span>
                </div>
                <p className="text-4xl font-black text-slate-900">{event.volunteersNeeded}</p>
                <div
                  className="mt-4 h-2 w-full rounded-full bg-slate-100"
                  role="progressbar"
                  aria-valuenow={pct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${pct}% del objetivo de voluntarios alcanzado`}
                >
                  <div className="h-full rounded-full bg-[#f49d25] transition-all" style={{ width: `${pct}%` }} />
                </div>
                <p className="mt-2 text-sm font-medium text-emerald-600">+{pct}% del objetivo alcanzado</p>
              </div>

              <div className="rounded-2xl bg-[#f8f7f5] p-8 shadow-sm border border-[#f49d25]/10">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-bold uppercase tracking-wider text-slate-500">Inscritos</p>
                  <span className="material-symbols-outlined text-[#f49d25]" aria-hidden="true">person_add</span>
                </div>
                <p className="text-4xl font-black text-slate-900">{event.volunteersJoined}</p>
                <p className="mt-4 text-sm text-slate-500">
                  {event.spotsLeft} cupos restantes para instructores y asistentes.
                </p>
              </div>

              <div className="rounded-2xl bg-[#f49d25] p-8 shadow-lg shadow-[#f49d25]/20 text-[#221a10]">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-bold uppercase tracking-wider opacity-70">Objetivo de Impacto</p>
                  <span className="material-symbols-outlined" aria-hidden="true">auto_graph</span>
                </div>
                <p className="text-4xl font-black">{event.studentsGoal}+</p>
                <p className="mt-4 text-sm font-medium">
                  Estudiantes a ser mentoreados durante este evento.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="mx-auto max-w-7xl px-6 lg:px-20 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-12">
              {/* About */}
              <div className="space-y-4">
                <h2 className="text-3xl font-bold flex items-center gap-3 text-slate-900">
                  <span className="h-8 w-1.5 bg-[#f49d25] rounded-full" />
                  Sobre el Evento
                </h2>
                <p className="text-lg leading-relaxed text-slate-600">{event.about}</p>
              </div>

              {/* Agenda */}
              <div className="space-y-6">
                <h2 className="text-3xl font-bold flex items-center gap-3 text-slate-900">
                  <span className="h-8 w-1.5 bg-[#f49d25] rounded-full" />
                  Agenda
                </h2>
                <div className="space-y-4">
                  {event.agenda.map((item: { time: string; title: string; description: string }, i: number) => (
                    <div
                      key={i}
                      className="flex gap-6 rounded-xl border border-[#f49d25]/10 p-5 bg-white shadow-sm"
                    >
                      <div className="text-[#f49d25] font-bold min-w-28 text-sm">{item.time}</div>
                      <div>
                        <h4 className="font-bold text-slate-900">{item.title}</h4>
                        <p className="text-sm text-slate-500 mt-1">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Inscription link (attendees) */}
              <div className="rounded-2xl border border-[#f49d25]/10 bg-white p-8 shadow-sm text-center space-y-4">
                <div className="size-14 bg-[#f49d25]/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-2xl text-[#f49d25]" aria-hidden="true">how_to_reg</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Inscripción de Asistentes</h3>
                <p className="text-sm text-slate-500">¿Quieres asistir a este evento? Completa tu inscripción.</p>
                <Link
                  href={`/events/${event.id}/inscripcion`}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#f49d25] px-8 py-3 font-bold text-white shadow-lg shadow-[#f49d25]/20 hover:scale-[1.02] transition-transform"
                >
                  <span className="material-symbols-outlined text-sm" aria-hidden="true">arrow_forward</span>
                  Inscribirme
                </Link>
              </div>

              {/* Volunteer application link */}
              <div id="postularme" className="rounded-2xl border border-[#f49d25]/10 bg-white p-8 shadow-sm text-center space-y-4">
                <div className="size-14 bg-[#f49d25]/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-2xl text-[#f49d25]" aria-hidden="true">volunteer_activism</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Postulación de Voluntarios</h3>
                <p className="text-sm text-slate-500">¿Quieres ser voluntario? Postúlate para este evento.</p>
                <Link
                  href={`/events/${event.id}/inscripcion`}
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-[#f49d25] px-8 py-3 font-bold text-[#f49d25] hover:bg-[#f49d25]/5 hover:scale-[1.02] transition-all"
                >
                  <span className="material-symbols-outlined text-sm" aria-hidden="true">arrow_forward</span>
                  Postularme
                </Link>
              </div>

              {/* Institution */}
              <div className="rounded-2xl border border-[#f49d25]/10 bg-white p-8 shadow-sm">
                <h3 className="text-xl font-bold mb-6 text-slate-900">Institución Anfitriona</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="size-16 rounded-xl bg-[#f49d25]/10 flex items-center justify-center text-[#f49d25]">
                    <span className="material-symbols-outlined text-4xl" aria-hidden="true">school</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{event.institution}</h4>
                    <p className="text-sm text-slate-500">Institución Educativa</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-6">
                  Comprometida con brindar recursos de calidad a comunidades que lo necesitan.
                </p>
              </div>

              {/* Sponsors */}
              <div className="rounded-2xl border border-[#f49d25]/10 bg-white p-8 shadow-sm">
                <h3 className="text-xl font-bold mb-4 text-slate-900">Sponsors</h3>
                <div className="flex flex-wrap gap-2">
                  {event.sponsors.map((s: string) => (
                    <span
                      key={s}
                      className="px-3 py-1 rounded-full bg-[#f49d25]/10 text-[#f49d25] text-sm font-bold"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="rounded-2xl border border-[#f49d25]/10 bg-white p-6 shadow-sm">
                <p className="text-xs font-bold text-[#f49d25] uppercase mb-1">Ubicación del Evento</p>
                <p className="text-sm font-bold text-slate-900">{event.fullLocation}</p>
              </div>

              {/* Review Form - only for finalized events */}
              {event.status === "finalizado" && (
                <ReviewForm eventId={event.dbId} userEmail={user?.email ?? null} />
              )}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-6 lg:px-20 pb-20">
          <div className="rounded-3xl bg-[#221a10] p-12 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[#f49d25]/10 opacity-30" />
            <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
              <h2 className="text-4xl font-black">¿Listo para generar impacto?</h2>
              <p className="text-lg text-slate-300">
                Tus habilidades pueden inspirar a un futuro líder. Únete a nuestro equipo de voluntarios hoy.
              </p>
              <div className="flex justify-center gap-4 pt-4 flex-wrap">
                <a
                  href="#postularme"
                  className="rounded-xl bg-[#f49d25] px-10 py-4 font-bold text-[#221a10] hover:scale-105 transition-transform"
                >
                  Ir al formulario de inscripción
                </a>
                <Link
                  href="/events"
                  className="rounded-xl border border-white/30 px-10 py-4 font-bold text-white hover:bg-white/10 transition-colors"
                >
                  Ver otros eventos
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
