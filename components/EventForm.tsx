"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { eventSchema, type EventFormData } from "@/lib/validations";
import { createEvent, updateEvent } from "@/lib/actions/events";
import { useToast } from "@/lib/useToast";
import ImageUpload from "@/components/ImageUpload";
import { DEFAULT_EVENT_ROLES, type EventRole } from "@/lib/roles";
import { useCommunity } from "@/lib/communityContext";

type Errors = Partial<Record<keyof EventFormData, string>>;

type AgendaItem = { time: string; title: string; description: string };

const EVENT_TYPES = ["Taller", "Conferencia", "Charla", "Programa", "Voluntariado Educativo", "Evento STEM", "Actividad Comunitaria"];

interface EventFormProps {
  mode: "create" | "edit";
  defaultValues?: Partial<EventFormData>;
  defaultAgenda?: AgendaItem[];
  eventId?: string;
  defaultRoles?: EventRole[];
}

export default function EventForm({ mode, defaultValues = {}, defaultAgenda, eventId, defaultRoles }: EventFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const { activeCommunity, communities } = useCommunity();
  const [form, setForm] = useState<Partial<EventFormData>>(defaultValues);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agenda, setAgenda] = useState<AgendaItem[]>(defaultAgenda ?? []);
  const [imageUrl, setImageUrl] = useState(defaultValues?.imageUrl ?? "");
  const [roles, setRoles] = useState<EventRole[]>(defaultRoles ?? [...DEFAULT_EVENT_ROLES]);

  // Communities where user can create events (lider or admin)
  const creatableCommunities = communities.filter((c) => c.role === "lider" || c.role === "admin");
  const [selectedCommunityId, setSelectedCommunityId] = useState(activeCommunity?.id ?? creatableCommunities[0]?.id ?? "");

  const totalVolunteers = roles.reduce((s, r) => s + (r.slots || 0), 0);

  const set = (field: keyof EventFormData, value: string | number) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  function validate(): boolean {
    const result = eventSchema.safeParse({
      ...form,
      sponsors: form.sponsors ?? "",
      studentsGoal: Number(form.studentsGoal) || 0,
      imageUrl: imageUrl || undefined,
      roles,
    });
    if (result.success) {
      setErrors({});
      return true;
    }
    const errs: Errors = {};
    result.error.issues.forEach((e) => {
      const key = e.path[0] as keyof EventFormData;
      errs[key] = e.message;
    });
    setErrors(errs);
    return false;
  }

  async function handleSubmit(e: React.FormEvent, status: "activo" | "borrador" = "activo") {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const formData: EventFormData = {
      ...form,
      sponsors: form.sponsors ?? "",
      studentsGoal: Number(form.studentsGoal) || 0,
      imageUrl: imageUrl || undefined,
      roles,
    } as EventFormData;

    const agendaToSend = agenda.filter((item) => item.time || item.title);
    const result = mode === "edit" && eventId
      ? await updateEvent(eventId, formData, agendaToSend)
      : await createEvent(formData, status, agendaToSend, selectedCommunityId);

    setLoading(false);

    if (result.error) {
      showToast(result.error, "error");
      return;
    }

    setSubmitted(true);
    showToast(
      mode === "edit" ? "Evento actualizado exitosamente" : "Evento creado exitosamente",
      "success"
    );
    setTimeout(() => router.push("/dashboard/events"), 1500);
  }

  if (submitted) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="size-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-4xl text-emerald-600">check_circle</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            {mode === "edit" ? "¡Evento actualizado!" : "¡Evento creado con éxito!"}
          </h2>
          <p className="text-slate-500">Redirigiendo a la gestión de eventos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/events"
          className="size-10 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-[#f49d25] transition-colors"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
        </Link>
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            {mode === "edit" ? "Editar Evento" : "Crear Nuevo Evento"}
          </h2>
          <p className="text-slate-500 mt-0.5">
            {mode === "edit" ? "Modifica la información del evento." : "Completa la información para publicar tu evento."}
          </p>
        </div>
      </div>

      <form onSubmit={(e) => handleSubmit(e)} className="space-y-8">
        {/* Comunidad */}
        {mode === "create" && creatableCommunities.length > 1 && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 shadow-sm">
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <span className="size-7 rounded-lg bg-[#f49d25]/10 flex items-center justify-center text-[#f49d25] text-sm font-black">
                <span className="material-symbols-outlined text-sm">groups</span>
              </span>
              Comunidad
            </h3>
            <Field label="Organizado por" required>
              <select
                value={selectedCommunityId}
                onChange={(e) => setSelectedCommunityId(e.target.value)}
                className={inputClass(false)}
              >
                {creatableCommunities.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </Field>
          </div>
        )}

        {/* Información básica */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 shadow-sm">
          <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
            <span className="size-7 rounded-lg bg-[#f49d25]/10 flex items-center justify-center text-[#f49d25] text-sm font-black">1</span>
            Información Básica
          </h3>

          <Field label="Título del evento" error={errors.title} required>
            <input
              type="text"
              placeholder="Ej: Taller STEM para Niños 2024"
              value={form.title ?? ""}
              onChange={(e) => set("title", e.target.value)}
              className={inputClass(!!errors.title)}
            />
          </Field>

          <Field label="Descripción corta" error={errors.description} required>
            <textarea
              rows={3}
              placeholder="Breve descripción del evento (aparece en las cards de listado)..."
              value={form.description ?? ""}
              onChange={(e) => set("description", e.target.value)}
              className={inputClass(!!errors.description)}
            />
          </Field>

          <Field label="Imagen del evento">
            <ImageUpload
              onUpload={(url) => setImageUrl(url)}
              currentUrl={imageUrl || undefined}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Tipo de evento" error={errors.type} required>
              <select
                value={form.type ?? ""}
                onChange={(e) => set("type", e.target.value)}
                className={inputClass(!!errors.type)}
              >
                <option value="">Seleccionar tipo...</option>
                {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>

            <Field label="Fecha" error={errors.date} required>
              <input
                type="date"
                value={form.date ?? ""}
                onChange={(e) => set("date", e.target.value)}
                className={inputClass(!!errors.date)}
              />
            </Field>
          </div>
        </div>

        {/* Ubicación */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 shadow-sm">
          <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
            <span className="size-7 rounded-lg bg-[#f49d25]/10 flex items-center justify-center text-[#f49d25] text-sm font-black">2</span>
            Ubicación
          </h3>

          <Field label="Nombre del lugar" error={errors.location} required>
            <input
              type="text"
              placeholder="Ej: Centro de Innovación Tech"
              value={form.location ?? ""}
              onChange={(e) => set("location", e.target.value)}
              className={inputClass(!!errors.location)}
            />
          </Field>

          <Field label="Dirección completa" error={errors.fullLocation} required>
            <input
              type="text"
              placeholder="Ej: Av. Universitaria 800, Lima"
              value={form.fullLocation ?? ""}
              onChange={(e) => set("fullLocation", e.target.value)}
              className={inputClass(!!errors.fullLocation)}
            />
          </Field>
        </div>

        {/* Voluntarios y alcance */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 shadow-sm">
          <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
            <span className="size-7 rounded-lg bg-[#f49d25]/10 flex items-center justify-center text-[#f49d25] text-sm font-black">3</span>
            Voluntarios y Alcance
          </h3>

          <Field label="Roles de voluntarios" error={errors.roles} required>
            <div className="space-y-3 mt-1">
              {roles.map((role, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-xs font-bold text-slate-400 min-w-[20px]">{index + 1}</span>
                  <input
                    type="text"
                    placeholder="Nombre del rol"
                    value={role.name}
                    onChange={(e) => {
                      const updated = [...roles];
                      updated[index] = { ...updated[index], name: e.target.value };
                      setRoles(updated);
                    }}
                    className={`flex-1 ${inputClass(false)}`}
                  />
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min={1}
                      placeholder="Cupos"
                      value={role.slots}
                      onChange={(e) => {
                        const updated = [...roles];
                        updated[index] = { ...updated[index], slots: parseInt(e.target.value) || 1 };
                        setRoles(updated);
                      }}
                      className={`w-20 ${inputClass(false)}`}
                    />
                    <span className="text-xs text-slate-400 whitespace-nowrap">cupos</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRoles(roles.filter((_, i) => i !== index))}
                    className="size-9 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors flex-shrink-0"
                    title="Eliminar rol"
                  >
                    <span className="material-symbols-outlined text-lg">close</span>
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => setRoles([...roles, { name: "", slots: 1 }])}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-slate-300 text-sm font-semibold text-slate-500 hover:border-[#f49d25] hover:text-[#f49d25] transition-colors w-full justify-center"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Agregar rol
              </button>
            </div>
          </Field>

          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#f49d25]/5 border border-[#f49d25]/20">
            <span className="material-symbols-outlined text-[#f49d25]">groups</span>
            <p className="text-sm font-semibold text-slate-700">
              Total voluntarios necesarios: <span className="text-[#f49d25] font-black">{totalVolunteers}</span>
            </p>
          </div>

          <Field label="Objetivo de estudiantes impactados" error={errors.studentsGoal} required>
            <input
              type="number"
              min={1}
              placeholder="Ej: 200"
              value={form.studentsGoal ?? ""}
              onChange={(e) => set("studentsGoal", parseInt(e.target.value))}
              className={inputClass(!!errors.studentsGoal)}
            />
          </Field>
        </div>

        {/* Institución y sponsors */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 shadow-sm">
          <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
            <span className="size-7 rounded-lg bg-[#f49d25]/10 flex items-center justify-center text-[#f49d25] text-sm font-black">4</span>
            Institución y Sponsors
          </h3>

          <Field label="Institución anfitriona" error={errors.institution} required>
            <input
              type="text"
              placeholder="Ej: Universidad Nacional de Ingeniería"
              value={form.institution ?? ""}
              onChange={(e) => set("institution", e.target.value)}
              className={inputClass(!!errors.institution)}
            />
          </Field>

          <Field label="Sponsors (separados por comas)" error={errors.sponsors}>
            <input
              type="text"
              placeholder="Ej: Google, Microsoft, Intel"
              value={form.sponsors ?? ""}
              onChange={(e) => set("sponsors", e.target.value)}
              className={inputClass(false)}
            />
          </Field>
        </div>

        {/* Descripción larga */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 shadow-sm">
          <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
            <span className="size-7 rounded-lg bg-[#f49d25]/10 flex items-center justify-center text-[#f49d25] text-sm font-black">5</span>
            Descripción Detallada
          </h3>

          <Field label="Sobre el evento" error={errors.about} required>
            <textarea
              rows={5}
              placeholder="Descripción completa del evento: objetivos, actividades, a quién va dirigido..."
              value={form.about ?? ""}
              onChange={(e) => set("about", e.target.value)}
              className={inputClass(!!errors.about)}
            />
          </Field>
        </div>

        {/* Agenda del evento */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 shadow-sm">
          <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
            <span className="size-7 rounded-lg bg-[#f49d25]/10 flex items-center justify-center text-[#f49d25] text-sm font-black">6</span>
            Agenda del Evento
          </h3>

          {agenda.length === 0 && (
            <p className="text-sm text-slate-400">No hay actividades en la agenda. Agrega una para comenzar.</p>
          )}

          {agenda.map((item, index) => (
            <div key={index} className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-xs font-bold text-slate-400 mt-2.5 min-w-[20px]">{index + 1}</span>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-500">Hora</label>
                  <input
                    type="text"
                    placeholder="Ej: 09:00 AM"
                    value={item.time}
                    onChange={(e) => {
                      const updated = [...agenda];
                      updated[index] = { ...updated[index], time: e.target.value };
                      setAgenda(updated);
                    }}
                    className={inputClass(false)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-500">Título</label>
                  <input
                    type="text"
                    placeholder="Ej: Registro de participantes"
                    value={item.title}
                    onChange={(e) => {
                      const updated = [...agenda];
                      updated[index] = { ...updated[index], title: e.target.value };
                      setAgenda(updated);
                    }}
                    className={inputClass(false)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-500">Descripción</label>
                  <input
                    type="text"
                    placeholder="Opcional"
                    value={item.description}
                    onChange={(e) => {
                      const updated = [...agenda];
                      updated[index] = { ...updated[index], description: e.target.value };
                      setAgenda(updated);
                    }}
                    className={inputClass(false)}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAgenda(agenda.filter((_, i) => i !== index))}
                className="mt-6 size-9 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                title="Eliminar actividad"
              >
                <span className="material-symbols-outlined text-lg">delete</span>
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => setAgenda([...agenda, { time: "", title: "", description: "" }])}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-slate-300 text-sm font-semibold text-slate-500 hover:border-[#f49d25] hover:text-[#f49d25] transition-colors w-full justify-center"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Agregar actividad
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard/events"
            className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </Link>
          <div className="flex gap-3">
            {mode === "create" && (
              <button
                type="button"
                disabled={loading}
                onClick={(e) => handleSubmit(e, "borrador")}
                className="px-6 py-3 rounded-xl border border-[#f49d25] text-[#f49d25] font-bold hover:bg-[#f49d25]/5 transition-colors disabled:opacity-50"
              >
                Guardar borrador
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#f49d25] text-white font-bold shadow-lg shadow-[#f49d25]/20 hover:brightness-105 transition-all disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm">publish</span>
              {loading ? "Guardando..." : mode === "edit" ? "Guardar Cambios" : "Publicar Evento"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function inputClass(hasError: boolean) {
  return `w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-colors ${
    hasError
      ? "border-red-300 focus:ring-red-200 bg-red-50"
      : "border-slate-200 focus:ring-[#f49d25]/30 focus:border-[#f49d25] bg-white"
  }`;
}

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="text-[#f49d25] ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <span className="material-symbols-outlined text-xs">error</span>
          {error}
        </p>
      )}
    </div>
  );
}
