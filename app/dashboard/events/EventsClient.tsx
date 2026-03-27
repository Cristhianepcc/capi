"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import EventActions from "./EventActions";

type Status = "todos" | "activo" | "borrador" | "finalizado";

const statusStyles: Record<string, string> = {
  activo: "bg-emerald-100 text-emerald-700",
  borrador: "bg-slate-100 text-slate-600",
  finalizado: "bg-blue-100 text-blue-700",
};

const statusLabel: Record<string, string> = {
  activo: "Activo",
  borrador: "Borrador",
  finalizado: "Finalizado",
};

interface Field {
  id: string;
  fieldKey: string;
  fieldLabel: string;
  fieldType: "text" | "email" | "phone" | "textarea" | "select" | "checkbox";
  required: boolean;
  placeholder: string;
  optionsJson: string[];
}

interface EventItem {
  id: string;
  dbId: string;
  title: string;
  description: string;
  date: string;
  location: string;
  type: string;
  status: string;
  image: string;
  volunteersNeeded: number;
  volunteersJoined: number;
  registrationFields: Field[];
}

export default function EventsClient({ initialEvents }: { initialEvents: EventItem[] }) {
  const [filter, setFilter] = useState<Status>("todos");
  const [search, setSearch] = useState("");

  const list = initialEvents;

  const filtered = list.filter((e) => {
    const matchStatus = filter === "todos" || e.status === filter;
    const matchSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const counts = {
    todos: list.length,
    activo: list.filter((e) => e.status === "activo").length,
    borrador: list.filter((e) => e.status === "borrador").length,
    finalizado: list.filter((e) => e.status === "finalizado").length,
  };

  const totalVoluntarios = list.reduce((s, e) => s + e.volunteersJoined, 0);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Gestión de Eventos</h2>
          <p className="text-slate-500 mt-1">Administra, edita y publica tus eventos.</p>
        </div>
        <Link
          href="/dashboard/events/new"
          className="flex items-center gap-2 bg-[#f49d25] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-[#f49d25]/20 hover:brightness-105 transition-all"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Nuevo Evento
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total eventos", value: counts.todos, icon: "event", color: "text-[#f49d25]", bg: "bg-[#f49d25]/10" },
          { label: "Activos", value: counts.activo, icon: "event_available", color: "text-emerald-600", bg: "bg-emerald-100" },
          { label: "Borradores", value: counts.borrador, icon: "edit_note", color: "text-slate-600", bg: "bg-slate-100" },
          { label: "Voluntarios totales", value: totalVoluntarios, icon: "group", color: "text-blue-600", bg: "bg-blue-100" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
            <div className={`size-12 rounded-xl ${s.bg} ${s.color} flex items-center justify-center`}>
              <span className="material-symbols-outlined">{s.icon}</span>
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500 font-medium">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
          <input
            type="text"
            placeholder="Buscar evento o ubicación..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f49d25]/30"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["todos", "activo", "borrador", "finalizado"] as Status[]).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                filter === s
                  ? "bg-[#f49d25] text-white border-[#f49d25]"
                  : "bg-white text-slate-600 border-slate-200 hover:border-[#f49d25] hover:text-[#f49d25]"
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)} ({counts[s]})
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <span className="material-symbols-outlined text-4xl mb-2 block">search_off</span>
            <p className="font-medium">No se encontraron eventos</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Evento</th>
                <th className="text-left px-4 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Tipo</th>
                <th className="text-left px-4 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Fecha</th>
                <th className="text-left px-4 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Voluntarios</th>
                <th className="text-left px-4 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Estado</th>
                <th className="text-right px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((event) => {
                const pct = Math.round((event.volunteersJoined / event.volunteersNeeded) * 100);
                return (
                  <tr key={event.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative size-12 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                          {event.image ? (
                            <Image src={event.image} alt={event.title} fill sizes="48px" className="object-cover" />
                          ) : (
                            <div className="size-12 flex items-center justify-center text-slate-300">
                              <span className="material-symbols-outlined">image</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{event.title}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <span className="material-symbols-outlined text-xs">location_on</span>
                            {event.location}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-2 py-1 rounded-full bg-[#f49d25]/10 text-[#f49d25] text-xs font-semibold">
                        {event.type}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700 font-medium">{event.date}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 max-w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="bg-[#f49d25] h-full rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs font-semibold text-slate-600">
                          {event.volunteersJoined}/{event.volunteersNeeded}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusStyles[event.status]}`}>
                        {statusLabel[event.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <EventActions eventId={event.dbId} eventSlug={event.id} initialFields={event.registrationFields} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <p className="text-xs text-slate-400 text-center">
        Mostrando {filtered.length} de {list.length} eventos
      </p>
    </div>
  );
}
