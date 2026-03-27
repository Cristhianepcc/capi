"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  updateInstitutionStatus,
  createInstitution,
  updateInstitution,
  deleteInstitution,
} from "@/lib/actions/institutions";
import { useToast } from "@/lib/useToast";

type Status = "todos" | "activo" | "solicitud" | "inactivo";
type InstitutionType = "colegio" | "universidad" | "centro_comunitario" | "ong" | "centro_educativo";

const INSTITUTION_TYPES: { value: InstitutionType; label: string }[] = [
  { value: "colegio", label: "Colegio" },
  { value: "universidad", label: "Universidad" },
  { value: "centro_comunitario", label: "Centro Comunitario" },
  { value: "ong", label: "ONG" },
  { value: "centro_educativo", label: "Centro Educativo" },
];

const TYPE_VALUE_MAP: Record<string, InstitutionType> = {
  Colegio: "colegio",
  Universidad: "universidad",
  "Centro Comunitario": "centro_comunitario",
  ONG: "ong",
  "Centro Educativo": "centro_educativo",
};

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

interface InstitutionItem {
  id: string;
  name: string;
  type: string;
  city: string;
  contact: string;
  email: string;
  status: string;
  eventsHosted: number;
  studentsImpacted: number;
  since: string;
}

export default function InstitutionsClient({ initialInstitutions }: { initialInstitutions: InstitutionItem[] }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [filter, setFilter] = useState<Status>("todos");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState<InstitutionType>("colegio");
  const [formCity, setFormCity] = useState("");
  const [formContact, setFormContact] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // Dropdown menu state
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const list = initialInstitutions;

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

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    }
    if (openMenuId) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [openMenuId]);

  async function handleStatusChange(id: string, status: "activo" | "inactivo") {
    setLoading(id);
    const result = await updateInstitutionStatus(id, status);
    if (result.error) {
      showToast(result.error, "error");
    } else {
      showToast(
        status === "activo" ? "Institución aceptada como aliada" : "Institución rechazada",
        status === "activo" ? "success" : "info"
      );
      router.refresh();
    }
    setLoading(null);
  }

  function openCreateForm() {
    setEditingId(null);
    setFormName("");
    setFormType("colegio");
    setFormCity("");
    setFormContact("");
    setFormEmail("");
    setShowForm(true);
  }

  function openEditForm(inst: InstitutionItem) {
    setEditingId(inst.id);
    setFormName(inst.name);
    setFormType(TYPE_VALUE_MAP[inst.type] ?? "colegio");
    setFormCity(inst.city);
    setFormContact(inst.contact);
    setFormEmail(inst.email);
    setShowForm(true);
    setOpenMenuId(null);
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormLoading(true);

    const formData = {
      name: formName,
      type: formType,
      city: formCity,
      contact: formContact,
      email: formEmail,
    };

    const result = editingId
      ? await updateInstitution(editingId, formData)
      : await createInstitution(formData);

    if (result.error) {
      showToast(result.error, "error");
    } else {
      showToast(
        editingId ? "Institución actualizada correctamente" : "Institución creada correctamente",
        "success"
      );
      setShowForm(false);
      router.refresh();
    }
    setFormLoading(false);
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm("¿Estás seguro de que deseas eliminar esta institución?");
    if (!confirmed) return;

    setOpenMenuId(null);
    setLoading(id);
    const result = await deleteInstitution(id);
    if (result.error) {
      showToast(result.error, "error");
    } else {
      showToast("Institución eliminada correctamente", "success");
      router.refresh();
    }
    setLoading(null);
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Instituciones</h2>
          <p className="text-slate-500 mt-1">Gestiona colegios, universidades y centros educativos aliados.</p>
        </div>
        <button
          onClick={openCreateForm}
          className="flex items-center gap-2 bg-[#f49d25] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-[#f49d25]/20 hover:brightness-105 transition-all"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Invitar Institución
        </button>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-lg text-slate-900 mb-4">
            {editingId ? "Editar Institución" : "Nueva Institución"}
          </h3>
          <form onSubmit={handleFormSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Nombre de la institución"
                required
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f49d25]/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value as InstitutionType)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f49d25]/30"
              >
                {INSTITUTION_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ciudad</label>
              <input
                type="text"
                value={formCity}
                onChange={(e) => setFormCity(e.target.value)}
                placeholder="Ciudad"
                required
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f49d25]/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contacto</label>
              <input
                type="text"
                value={formContact}
                onChange={(e) => setFormContact(e.target.value)}
                placeholder="Nombre del contacto"
                required
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f49d25]/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                placeholder="email@ejemplo.com"
                required
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f49d25]/30"
              />
            </div>
            <div className="flex items-end gap-3">
              <button
                type="submit"
                disabled={formLoading}
                className="px-5 py-2 bg-[#f49d25] text-white rounded-lg font-bold text-sm hover:brightness-105 transition-all disabled:opacity-50"
              >
                {formLoading ? "Guardando..." : "Guardar"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-5 py-2 bg-slate-100 text-slate-600 rounded-lg font-bold text-sm hover:bg-slate-200 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

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
                        {inst.type} - {inst.city} - Contacto: {inst.contact}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusChange(inst.id, "activo")}
                      disabled={loading === inst.id}
                      className="px-4 py-2 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-bold hover:bg-emerald-200 transition-colors disabled:opacity-50"
                    >
                      Aceptar alianza
                    </button>
                    <button
                      onClick={() => handleStatusChange(inst.id, "inactivo")}
                      disabled={loading === inst.id}
                      className="px-4 py-2 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                    >
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
                  <p className="text-xs text-slate-500">{inst.type} - {inst.city}</p>
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
                  {inst.studentsImpacted > 0 ? inst.studentsImpacted.toLocaleString() : "\u2014"}
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
                <div className="relative" ref={openMenuId === inst.id ? menuRef : undefined}>
                  <button
                    onClick={() => setOpenMenuId(openMenuId === inst.id ? null : inst.id)}
                    className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-[#f49d25]/10 hover:text-[#f49d25] transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">more_vert</span>
                  </button>
                  {openMenuId === inst.id && (
                    <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-20 min-w-[140px] py-1">
                      <button
                        onClick={() => openEditForm(inst)}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">edit</span>
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(inst.id)}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {inst.since !== "\u2014" && (
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
