import { notFound } from "next/navigation";
import Link from "next/link";
import { getEventBySlug, getEventRegistrationFields } from "@/lib/queries";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InscriptionForm from "./InscriptionForm";

export default async function InscriptionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEventBySlug(id);

  if (!event) notFound();

  // Show message if event is not active instead of silent redirect
  if (event.status !== "activo") {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8f7f5]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center space-y-4 max-w-md px-6">
            <div className="size-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-3xl text-slate-400" aria-hidden="true">event_busy</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">Inscripciones cerradas</h2>
            <p className="text-sm text-slate-500">
              Este evento ya no acepta inscripciones en este momento.
            </p>
            <Link
              href={`/events/${id}`}
              className="inline-block rounded-xl bg-[#f49d25] px-6 py-2.5 font-bold text-white text-sm hover:brightness-105 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f49d25]"
            >
              Volver al evento
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const regFields = await getEventRegistrationFields(event.id);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f7f5]">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          {/* Event header */}
          <div className="mb-8 space-y-2">
            <p className="text-sm font-bold text-[#f49d25] uppercase tracking-wider">
              Inscripción al Evento
            </p>
            <h1 className="text-3xl font-black text-slate-900">{event.title}</h1>
            <p className="text-slate-500 text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-sm" aria-hidden="true">calendar_today</span>
              {event.date} · {event.location}
            </p>
          </div>

          <InscriptionForm
            eventId={event.id}
            eventSlug={event.slug}
            roles={event.roles}
            regFields={regFields}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
