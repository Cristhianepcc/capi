"use client";

import { useState } from "react";
import { institutions } from "@/lib/data";

type Status = "todos" | "activo" | "solicitud" | "inactivo";

const statusStyles: Record<string, string> = {
  activo: "bg-emerald-100 text-emerald-700",
  solicitud: "bg-amber-100 text-amber-700",
  inactivo: "bg-slate-100 text-slate-500",
};

const typeIcon: Record<string, string> = {
  Colegio: "school",
  Universidad: "account_balance",
  "Centro Comunitario": "groups",
  "Centro Educativo": "menu_book",
  ONG: "volunteer_activism",
};

export default function InstitutionsPage() {
  const [filter, setFilter] = useState<Status>("todos");
  const [search, setSearch] = useState("");
  const [list, setList] = useState(institutions);

  const filtered = list.filter((inst) => {
    const matchStatus = filter === "todos" || inst.status === filter;
    const matchSearch =
      inst.name.toLowerCase().includes(search.toLowerCase()) ||
      inst.city.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const counts = {
    todos: list.length,
    activo: list.filter((i) => i.status === "activo").length,
    solicitud: list.filter((i) => i.status === "solicitud").length,
    inactivo: list.filter((i) => i.status === "inactivo").length,
  };

  const totalStudents = list
    .filter((i) => i.status === "activo")
    .reduce((s, i) => s + i.studentsImpacted, 0);

  const approve = (id: string) =>
    setList((prev) => prev.map((i) => (i.id === id ? { ...i, status: "activo", since: "Nov 2024", eventsHosted: 1 } : i)));

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Instituciones</h2>
          <p className="text-slate-500 mt-1">Gestiona colegios, universidades y centros educativos aliados.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#f49d25] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-[#f49d25]/20 hover:brightness-105 transition-all">
          <span className="material-symbols-outlined text-sm">add</span>
          Invitar Institución
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total instituciones", value: counts.todos, icon: "corporate_fare", color: "text-[#f49d25]", bg: "bg-[#f49d25]/10" },
          { label: "Alianzas activas", value: counts.activo, icon: "handshake", color: "text-emerald-600", bg: "bg-emerald-100" },
          { label: "Solicitudes pendientes", value: counts.solicitud, icon: "pending_actions", color: "text-amber-600", bg: "bg-amber-100" },
          { label: "Estudiantes impactados", value: totalStudents.toLocaleString(), icon: "school", color: "text-blue-600", bg: "bg-blue-100" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
            <div className={`size-12 rounded-xl ${s.bg} ${s.color} flex items-center justify-center flex-shrink-0`}>
              <span className="material-symbols-outlined">{s.icon}</span>
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500 font-medium">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Solicitudes pendientes destacadas */}
      {counts.solicitud > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-amber-600">pending_actions</span>
            <h3 className="font-bold text-amber-800">
              {counts.solicitud} solicitud{counts.solicitud > 1 ? "es" : ""} pendiente{counts.solicitud > 1 ? "s" : ""} de aprobación
            </h3>
          </div>
          <div className="space-y-3">
            {list
              .filter((i) => i.status === "solicitud")
              .map((inst) => (
                <div key={inst.id} className="flex items-center justify-between bg-white rounded-lg p-4 border border-amber-100">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                      <span className="material-symbols-outlined">{typeIcon[inst.type] ?? "school"}</span>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{inst.name}</p>
                      <p className="text-xs text-slate-500">
                        {inst.type} • {inst.city} • Contacto: {inst.contact}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => approve(inst.id)}
                      className="px-4 py-2 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-bold hover:bg-emerald-200 transition-colors"
                    >
                      Aceptar alianza
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold hover:bg-red-50 hover:text-red-600 transition-colors">
                      Rechazar
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
          <input
            type="text"
            placeholder="Buscar institución o ciudad..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f49d25]/30"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["todos", "activo", "solicitud", "inactivo"] as Status[]).map((s) => (
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

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((inst) => (
          <div
            key={inst.id}
            className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-xl bg-[#f49d25]/10 flex items-center justify-center text-[#f49d25]">
                  <span className="material-symbols-outlined">{typeIcon[inst.type] ?? "school"}</span>
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm leading-tight">{inst.name}</p>
                  <p className="text-xs text-slate-500">{inst.type} • {inst.city}</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0 ${statusStyles[inst.status]}`}>
                {inst.status.charAt(0).toUpperCase() + inst.status.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-lg p-3 text-center">
                <p className="text-xl font-black text-slate-900">{inst.eventsHosted}</p>
                <p className="text-xs text-slate-500">Eventos realizados</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 text-center">
                <p className="text-xl font-black text-slate-900">
                  {inst.studentsImpacted > 0 ? inst.studentsImpacted.toLocaleString() : "—"}
                </p>
                <p className="text-xs text-slate-500">Estudiantes</p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Contacto: <span className="font-semibold text-slate-700">{inst.contact}</span></p>
                <p className="text-xs text-slate-400">{inst.email}</p>
              </div>
              <div className="flex gap-2">
                <a
                  href={`mailto:${inst.email}`}
                  className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-[#f49d25]/10 hover:text-[#f49d25] transition-colors"
                  title="Enviar email"
                >
                  <span className="material-symbols-outlined text-sm">mail</span>
                </a>
                <button className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-[#f49d25]/10 hover:text-[#f49d25] transition-colors">
                  <span className="material-symbols-outlined text-sm">more_vert</span>
                </button>
              </div>
            </div>

            {inst.since !== "—" && (
              <p className="text-[10px] text-slate-400 -mt-2">Aliado desde {inst.since}</p>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-400">
            <span className="material-symbols-outlined text-4xl mb-2 block">search_off</span>
            <p className="font-medium">No se encontraron instituciones</p>
          </div>
        )}
      </div>
    </div>
  );
}
