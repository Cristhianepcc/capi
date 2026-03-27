"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { updateVolunteerStatus, updateVolunteerRole, updateVolunteerHours } from "@/lib/actions/volunteers";
import { useToast } from "@/lib/useToast";

type Status = "todos" | "aprobado" | "pendiente" | "rechazado";

const statusStyles: Record<string, string> = {
  aprobado: "bg-emerald-100 text-emerald-700",
  pendiente: "bg-amber-100 text-amber-700",
  rechazado: "bg-red-100 text-red-700",
};

interface VolunteerItem {
  id: string;
  name: string;
  email: string;
  event: string;
  role: string;
  status: string;
  hours: number;
  joinedAt: string;
  initials: string;
  color: string;
  eventRoles: string[];
}

export default function VolunteersClient({ initialVolunteers }: { initialVolunteers: VolunteerItem[] }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [filter, setFilter] = useState<Status>("todos");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("Todos los roles");
  const [loading, setLoading] = useState<string | null>(null);
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [editingHours, setEditingHours] = useState<string | null>(null);
  const [hoursValue, setHoursValue] = useState("");

  const list = initialVolunteers;

  const uniqueRoles = useMemo(() => {
    const roles = new Set(list.map((v) => v.role));
    return ["Todos los roles", ...Array.from(roles).sort()];
  }, [list]);

  const filtered = list.filter((v) => {
    const matchStatus = filter === "todos" || v.status === filter;
    const matchSearch =
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.event.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "Todos los roles" || v.role === roleFilter;
    return matchStatus && matchSearch && matchRole;
  });

  async function handleStatusChange(id: string, status: "aprobado" | "rechazado") {
    setLoading(id);
    const result = await updateVolunteerStatus(id, status);
    if (result.error) {
      showToast(result.error, "error");
    } else {
      showToast(`Voluntario ${status === "aprobado" ? "aprobado" : "rechazado"}`, "success");
      router.refresh();
    }
    setLoading(null);
  }

  async function handleRoleChange(id: string, role: string) {
    setLoading(id);
    const result = await updateVolunteerRole(id, role);
    if (result.error) {
      showToast(result.error, "error");
    } else {
      showToast("Rol actualizado", "success");
      router.refresh();
    }
    setEditingRole(null);
    setLoading(null);
  }

  async function handleHoursSubmit(id: string) {
    const hours = Number(hoursValue);
    if (isNaN(hours) || hours < 0) return;
    setLoading(id);
    const result = await updateVolunteerHours(id, hours);
    if (result.error) {
      showToast(result.error, "error");
    } else {
      showToast("Horas actualizadas", "success");
      router.refresh();
    }
    setEditingHours(null);
    setLoading(null);
  }

  const counts = {
    todos: list.length,
    aprobado: list.filter((v) => v.status === "aprobado").length,
    pendiente: list.filter((v) => v.status === "pendiente").length,
    rechazado: list.filter((v) => v.status === "rechazado").length,
  };
  const totalHours = list.filter((v) => v.status === "aprobado").reduce((s, v) => s + v.hours, 0);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Gestión de Voluntarios</h2>
        <p className="text-slate-500 mt-1">Aprueba postulaciones, asigna roles y gestiona horarios.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total voluntarios", value: counts.todos, icon: "group", color: "text-[#f49d25]", bg: "bg-[#f49d25]/10" },
          { label: "Aprobados", value: counts.aprobado, icon: "check_circle", color: "text-emerald-600", bg: "bg-emerald-100" },
          { label: "Pendientes", value: counts.pendiente, icon: "schedule", color: "text-amber-600", bg: "bg-amber-100" },
          { label: "Horas voluntariado", value: `${totalHours}h`, icon: "timer", color: "text-blue-600", bg: "bg-blue-100" },
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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
          <input
            type="text"
            placeholder="Buscar voluntario o evento..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f49d25]/30"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {(["todos", "aprobado", "pendiente", "rechazado"] as Status[]).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all capitalize ${
                filter === s
                  ? "bg-[#f49d25] text-white border-[#f49d25]"
                  : "bg-white text-slate-600 border-slate-200 hover:border-[#f49d25] hover:text-[#f49d25]"
              }`}
            >
              {s === "todos" ? `Todos (${counts.todos})` : `${s.charAt(0).toUpperCase() + s.slice(1)} (${counts[s]})`}
            </button>
          ))}
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f49d25]/30 text-slate-700"
        >
          {uniqueRoles.map((r) => <option key={r}>{r}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <span className="material-symbols-outlined text-4xl mb-2 block">search_off</span>
            <p className="font-medium">No se encontraron voluntarios</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Voluntario</th>
                <th className="text-left px-4 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Evento</th>
                <th className="text-left px-4 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Rol</th>
                <th className="text-left px-4 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Horas</th>
                <th className="text-left px-4 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Estado</th>
                <th className="text-right px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`size-10 rounded-full ${v.color} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                        {v.initials}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{v.name}</p>
                        <p className="text-xs text-slate-500">{v.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm text-slate-700 font-medium">{v.event}</p>
                    <p className="text-xs text-slate-400">{v.joinedAt}</p>
                  </td>
                  <td className="px-4 py-4">
                    {editingRole === v.id ? (
                      <select
                        autoFocus
                        defaultValue={v.role}
                        onChange={(e) => handleRoleChange(v.id, e.target.value)}
                        onBlur={() => {
                          setTimeout(() => setEditingRole(null), 150);
                        }}
                        disabled={loading === v.id}
                        className="px-2 py-1 rounded-lg border border-slate-200 text-xs disabled:opacity-50"
                      >
                        {(v.eventRoles.length > 0 ? v.eventRoles : [v.role]).map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                        {v.role}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    {editingHours === v.id ? (
                      <form onSubmit={(e) => { e.preventDefault(); handleHoursSubmit(v.id); }} className="flex gap-1">
                        <input
                          type="number"
                          min={0}
                          autoFocus
                          value={hoursValue}
                          onChange={(e) => setHoursValue(e.target.value)}
                          onBlur={() => setEditingHours(null)}
                          className="w-16 px-2 py-1 rounded-lg border border-slate-200 text-xs"
                        />
                      </form>
                    ) : (
                      <button
                        onClick={() => { setEditingHours(v.id); setHoursValue(String(v.hours)); }}
                        className="text-sm font-bold text-slate-900 hover:text-[#f49d25] transition-colors"
                      >
                        {v.hours > 0 ? `${v.hours}h` : "—"}
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${statusStyles[v.status]}`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {v.status === "pendiente" && (
                        <>
                          <button
                            onClick={() => handleStatusChange(v.id, "aprobado")}
                            disabled={loading === v.id}
                            className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold hover:bg-emerald-100 transition-colors disabled:opacity-50"
                          >
                            Aprobar
                          </button>
                          <button
                            onClick={() => handleStatusChange(v.id, "rechazado")}
                            disabled={loading === v.id}
                            className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-colors disabled:opacity-50"
                          >
                            Rechazar
                          </button>
                        </>
                      )}
                      {v.status === "aprobado" && (
                        <button
                          onClick={() => setEditingRole(v.id)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold hover:bg-[#f49d25]/10 hover:text-[#f49d25] transition-colors flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-xs">badge</span>
                          Asignar rol
                        </button>
                      )}
                      {v.status === "rechazado" && (
                        <button
                          onClick={() => handleStatusChange(v.id, "aprobado")}
                          disabled={loading === v.id}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold hover:bg-emerald-50 hover:text-emerald-700 transition-colors disabled:opacity-50"
                        >
                          Reactivar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="text-xs text-slate-400 text-center">
        Mostrando {filtered.length} de {list.length} voluntarios
      </p>
    </div>
  );
}
