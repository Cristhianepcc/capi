"use client";

import { useState } from "react";
import Link from "next/link";
import { cancelApplication } from "@/lib/actions/volunteerSelf";

interface MyEvent {
  eventVolunteerId: string;
  eventSlug: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  role: string;
  status: "pendiente" | "aprobado" | "rechazado";
  hours: number;
}

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  pendiente: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Pendiente" },
  aprobado: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Aprobado" },
  rechazado: { bg: "bg-red-100", text: "text-red-700", label: "Rechazado" },
};

export default function MyEventsClient({ events }: { events: MyEvent[] }) {
  const [items, setItems] = useState(events);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  async function handleCancel(eventVolunteerId: string) {
    if (!confirm("¿Cancelar tu postulación a este evento?")) return;
    setCancellingId(eventVolunteerId);
    const result = await cancelApplication(eventVolunteerId);
    if (result.error) {
      alert(result.error);
      setCancellingId(null);
      return;
    }
    setItems((prev) => prev.filter((e) => e.eventVolunteerId !== eventVolunteerId));
    setCancellingId(null);
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Mis Eventos</h2>
        <p className="text-slate-500 mt-1">Eventos en los que te has inscrito como voluntario.</p>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <span className="material-symbols-outlined text-4xl text-slate-300 mb-4 block">calendar_today</span>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Sin eventos aún</h3>
          <p className="text-sm text-slate-500 mb-4">Explora eventos disponibles y postúlate como voluntario.</p>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 bg-[#f49d25] text-white font-bold px-6 py-2.5 rounded-lg hover:brightness-105 transition-all"
          >
            <span className="material-symbols-outlined text-sm">explore</span>
            Explorar eventos
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((event) => {
            const style = STATUS_STYLES[event.status] ?? STATUS_STYLES.pendiente;
            const isPastEvent = new Date(event.eventDate) < new Date();
            return (
              <div
                key={event.eventVolunteerId}
                className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex-1 space-y-1">
                  <Link
                    href={`/events/${event.eventSlug}`}
                    className="text-lg font-bold text-slate-900 hover:text-[#f49d25] transition-colors"
                  >
                    {event.eventTitle}
                  </Link>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">calendar_today</span>
                      {new Date(event.eventDate).toLocaleDateString("es-PE", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">location_on</span>
                      {event.eventLocation}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">badge</span>
                      {event.role.charAt(0).toUpperCase() + event.role.slice(1)}
                    </span>
                    {event.hours > 0 && (
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">schedule</span>
                        {event.hours}h
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${style.bg} ${style.text}`}>
                    {style.label}
                  </span>
                  {event.status === "pendiente" && !isPastEvent && (
                    <button
                      onClick={() => handleCancel(event.eventVolunteerId)}
                      disabled={cancellingId === event.eventVolunteerId}
                      className="text-sm text-red-500 hover:text-red-700 font-medium disabled:opacity-50"
                    >
                      Cancelar
                    </button>
                  )}
                  {isPastEvent && event.status === "aprobado" && (
                    <Link
                      href={`/events/${event.eventSlug}`}
                      className="text-sm text-[#f49d25] hover:underline font-medium"
                    >
                      Dejar reseña
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
