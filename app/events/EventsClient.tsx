"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";

const TYPES = ["Todos", "Taller", "Conferencia", "Charla", "Programa", "Voluntariado Educativo", "Evento STEM"];

interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  type: string;
  spotsLeft: number;
  image: string;
  communityName?: string | null;
  communitySlug?: string | null;
}

export default function EventsClient({ events }: { events: EventItem[] }) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("Todos");

  const filtered = events.filter((e) => {
    const matchType = typeFilter === "Todos" || e.type === typeFilter;
    const matchSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f7f5]">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-6 lg:px-10 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Explorar Eventos</h1>
          <p className="mt-2 text-slate-600 text-lg">
            Encuentra el evento perfecto para contribuir con tu comunidad.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 mb-10">
          <div className="relative max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              search
            </span>
            <input
              type="text"
              placeholder="Buscar por nombre, lugar o descripción..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f49d25]/50"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                  typeFilter === type
                    ? "bg-[#f49d25] text-white border-[#f49d25]"
                    : "bg-white text-slate-600 border-slate-200 hover:border-[#f49d25] hover:text-[#f49d25]"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-6 mb-8 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 text-[#f49d25]">
            <span className="material-symbols-outlined">calendar_month</span>
            <span className="font-bold text-slate-900">
              {filtered.length} evento{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
          {(search || typeFilter !== "Todos") && (
            <button
              onClick={() => { setSearch(""); setTypeFilter("Todos"); }}
              className="text-sm text-slate-400 hover:text-[#f49d25] flex items-center gap-1 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">close</span>
              Limpiar filtros
            </button>
          )}
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center text-slate-400">
            <span className="material-symbols-outlined text-5xl mb-3 block">search_off</span>
            <p className="text-lg font-semibold">No se encontraron eventos</p>
            <p className="text-sm mt-1">Prueba con otros términos de búsqueda</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
