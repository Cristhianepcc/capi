import Link from "next/link";
import Image from "next/image";
import { events } from "@/lib/data";

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

export default function DashboardEventsPage() {
  const total = events.length;
  const activos = events.filter((e) => e.status === "activo").length;
  const borradores = events.filter((e) => e.status === "borrador").length;
  const totalVoluntarios = events.reduce((s, e) => s + e.volunteersJoined, 0);

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
          { label: "Total eventos", value: total, icon: "event", color: "text-[#f49d25]", bg: "bg-[#f49d25]/10" },
          { label: "Activos", value: activos, icon: "event_available", color: "text-emerald-600", bg: "bg-emerald-100" },
          { label: "Borradores", value: borradores, icon: "edit_note", color: "text-slate-600", bg: "bg-slate-100" },
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
      <div className="flex gap-3">
        {["Todos", "Activo", "Borrador", "Finalizado"].map((f) => (
          <button
            key={f}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
              f === "Todos"
                ? "bg-[#f49d25] text-white border-[#f49d25]"
                : "bg-white text-slate-600 border-slate-200 hover:border-[#f49d25] hover:text-[#f49d25]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
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
            {events.map((event) => {
              const pct = Math.round((event.volunteersJoined / event.volunteersNeeded) * 100);
              return (
                <tr key={event.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative size-12 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                        <Image src={event.image} alt={event.title} fill sizes="48px" className="object-cover" />
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
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/events/${event.id}`}
                        className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-[#f49d25]/10 hover:text-[#f49d25] transition-colors"
                        title="Ver pública"
                      >
                        <span className="material-symbols-outlined text-sm">open_in_new</span>
                      </Link>
                      <button
                        className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-[#f49d25]/10 hover:text-[#f49d25] transition-colors"
                        title="Editar"
                      >
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                      <button
                        className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Eliminar"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
