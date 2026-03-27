import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCommunityBySlug, getCommunityEvents, getCommunityMembers } from "@/lib/queries";

const SOCIAL_LINKS = [
  { key: "website", icon: "language", label: "Sitio web", prefix: "" },
  { key: "instagram", icon: null, label: "Instagram", prefix: "https://instagram.com/", svg: <svg className="size-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg> },
  { key: "twitter", icon: null, label: "X", prefix: "https://x.com/", svg: <svg className="size-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
  { key: "linkedin", icon: null, label: "LinkedIn", prefix: "", svg: <svg className="size-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
  { key: "github", icon: null, label: "GitHub", prefix: "https://github.com/", svg: <svg className="size-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg> },
  { key: "discord", icon: null, label: "Discord", prefix: "", svg: <svg className="size-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z"/></svg> },
] as const;

export default async function CommunityPublicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const community = await getCommunityBySlug(slug);
  if (!community) notFound();

  const [events, members] = await Promise.all([
    getCommunityEvents(community.id),
    getCommunityMembers(community.id),
  ]);

  const upcomingEvents = events.filter((e) => e.status === "activo");
  const pastEvents = events.filter((e) => e.status === "finalizado");
  const totalVolunteers = events.reduce((s, e) => s + e.volunteersJoined, 0);
  const totalStudents = events.reduce((s, e) => s + e.studentsGoal, 0);

  // Collect active social links
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c = community as any;
  const activeSocials = SOCIAL_LINKS.filter((s) => {
    const val = c[s.key];
    return val && val.trim().length > 0;
  });

  function getSocialUrl(social: typeof SOCIAL_LINKS[number], value: string): string {
    if (social.key === "website" || value.startsWith("http")) return value;
    const clean = value.replace(/^@/, "");
    return social.prefix + clean;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f7f5]">
      <Navbar />

      <main className="flex-1">
        {/* Hero banner */}
        <section className="relative bg-gradient-to-br from-[#221a10] to-[#3d2e17] overflow-hidden">
          <div className="absolute inset-0 bg-[#f49d25]/5" />
          <div className="relative mx-auto max-w-7xl px-6 lg:px-10 py-16 lg:py-20">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-8">
              <Link href="/communities" className="text-sm text-white/50 hover:text-white/80 transition-colors">
                Comunidades
              </Link>
              <span className="material-symbols-outlined text-white/30 text-sm">chevron_right</span>
              <span className="text-sm font-semibold text-white/80">{community.name}</span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center gap-8">
              {/* Logo */}
              <div className="flex-shrink-0">
                {community.logo_url ? (
                  <div className="size-28 lg:size-36 rounded-2xl overflow-hidden border-4 border-white/10 shadow-2xl bg-white">
                    <Image
                      src={community.logo_url}
                      alt={community.name}
                      width={144}
                      height={144}
                      className="object-cover size-full"
                    />
                  </div>
                ) : (
                  <div className="size-28 lg:size-36 rounded-2xl bg-[#f49d25]/20 border-4 border-white/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#f49d25] text-6xl lg:text-7xl">groups</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 space-y-4">
                <h1 className="text-3xl lg:text-5xl font-black tracking-tight text-white">
                  {community.name}
                </h1>
                {community.description && (
                  <p className="text-lg text-white/70 max-w-2xl leading-relaxed">{community.description}</p>
                )}

                {/* Social links */}
                {activeSocials.length > 0 && (
                  <div className="flex flex-wrap gap-3 pt-2">
                    {activeSocials.map((social) => {
                      const value = c[social.key] as string;
                      const url = getSocialUrl(social, value);
                      return (
                        <a
                          key={social.key}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors backdrop-blur-sm"
                        >
                          {social.icon ? (
                            <span className="material-symbols-outlined text-sm">{social.icon}</span>
                          ) : (
                            social.svg
                          )}
                          {social.label}
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Stats bar */}
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Eventos", value: events.length, icon: "event" },
                { label: "Miembros", value: members.length, icon: "person" },
                { label: "Voluntarios", value: totalVolunteers, icon: "volunteer_activism" },
                { label: "Estudiantes impactados", value: totalStudents, icon: "school" },
              ].map((s) => (
                <div key={s.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-[#f49d25] text-lg">{s.icon}</span>
                    <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">{s.label}</span>
                  </div>
                  <p className="text-3xl font-black text-white">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Events */}
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-12 space-y-16">
          {/* Upcoming */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <span className="h-7 w-1.5 bg-[#f49d25] rounded-full" />
                Proximos Eventos
              </h2>
              <span className="text-sm text-slate-400 font-medium">{upcomingEvents.length} evento{upcomingEvents.length !== 1 ? "s" : ""}</span>
            </div>

            {upcomingEvents.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
                <span className="material-symbols-outlined text-4xl text-slate-300 mb-2 block">calendar_today</span>
                <p className="text-slate-500 font-medium">No hay eventos proximos por ahora.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map((event) => (
                  <EventPublicCard key={event.dbId} event={event} />
                ))}
              </div>
            )}
          </section>

          {/* Past */}
          {pastEvents.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                  <span className="h-7 w-1.5 bg-slate-300 rounded-full" />
                  Eventos Anteriores
                </h2>
                <span className="text-sm text-slate-400 font-medium">{pastEvents.length} evento{pastEvents.length !== 1 ? "s" : ""}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastEvents.map((event) => (
                  <EventPublicCard key={event.dbId} event={event} past />
                ))}
              </div>
            </section>
          )}

          {/* CTA */}
          <section className="rounded-3xl bg-[#f49d25] p-12 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[#f49d25]/10 opacity-30" />
            <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
              <h2 className="text-3xl font-black">Unete a {community.name}</h2>
              <p className="text-lg text-white/80">
                Explora los eventos de esta comunidad y postulate como voluntario.
              </p>
              <div className="flex justify-center gap-4 pt-4 flex-wrap">
                <Link
                  href="/events"
                  className="rounded-xl bg-white px-8 py-4 font-black text-[#f49d25] hover:scale-105 transition-transform"
                >
                  Explorar Eventos
                </Link>
                <Link
                  href="/register"
                  className="rounded-xl border-2 border-white/30 px-8 py-4 font-black text-white hover:bg-white/10 transition-colors"
                >
                  Crear Cuenta
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function EventPublicCard({
  event,
  past,
}: {
  event: {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    type: string;
    image: string;
    volunteersNeeded: number;
    volunteersJoined: number;
    spotsLeft: number;
    institution: string;
  };
  past?: boolean;
}) {
  const pct = event.volunteersNeeded > 0
    ? Math.round((event.volunteersJoined / event.volunteersNeeded) * 100)
    : 0;

  return (
    <Link
      href={`/events/${event.id}`}
      className={`group flex flex-col rounded-2xl bg-white border shadow-sm overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl ${
        past ? "border-slate-100 opacity-80 hover:opacity-100" : "border-slate-100"
      }`}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        {event.image ? (
          <Image
            src={event.image}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-300">
            <span className="material-symbols-outlined text-4xl">image</span>
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-bold text-slate-900">
            {event.type}
          </span>
          {past && (
            <span className="px-2.5 py-1 rounded-full bg-slate-800/80 text-xs font-bold text-white">
              Finalizado
            </span>
          )}
        </div>
      </div>
      <div className="p-5 flex flex-col gap-2 flex-1">
        <div className="flex items-center gap-2 text-[#f49d25]">
          <span className="material-symbols-outlined text-sm">event</span>
          <span className="text-xs font-bold uppercase">{event.date} • {event.location}</span>
        </div>
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#f49d25] transition-colors line-clamp-2">
          {event.title}
        </h3>
        <p className="text-sm text-slate-500 line-clamp-2 flex-1">{event.description}</p>
        <div className="mt-3 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-500">{event.volunteersJoined}/{event.volunteersNeeded} voluntarios</span>
            <span className="font-bold text-slate-700">{pct}%</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${past ? "bg-slate-400" : "bg-[#f49d25]"}`}
              style={{ width: `${Math.min(pct, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
