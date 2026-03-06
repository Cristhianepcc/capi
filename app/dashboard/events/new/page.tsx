"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";

const eventSchema = z.object({
  title: z.string().min(5, "Mínimo 5 caracteres"),
  description: z.string().min(20, "Mínimo 20 caracteres"),
  type: z.string().min(1, "Selecciona un tipo"),
  date: z.string().min(1, "Selecciona una fecha"),
  location: z.string().min(3, "Mínimo 3 caracteres"),
  fullLocation: z.string().min(5, "Ingresa la dirección completa"),
  volunteersNeeded: z.number().min(1, "Al menos 1 voluntario"),
  studentsGoal: z.number().min(1, "Al menos 1 estudiante"),
  institution: z.string().min(2, "Ingresa la institución"),
  sponsors: z.string(),
  about: z.string().min(30, "Mínimo 30 caracteres"),
});

type FormData = z.infer<typeof eventSchema>;
type Errors = Partial<Record<keyof FormData, string>>;

const EVENT_TYPES = ["Taller", "Conferencia", "Charla", "Programa", "Voluntariado Educativo", "Evento STEM", "Actividad Comunitaria"];

export default function NewEventPage() {
  const router = useRouter();
  const [form, setForm] = useState<Partial<FormData>>({});
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const set = (field: keyof FormData, value: string | number) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  function validate(): boolean {
    const result = eventSchema.safeParse({
      ...form,
      volunteersNeeded: Number(form.volunteersNeeded) || 0,
      studentsGoal: Number(form.studentsGoal) || 0,
    });
    if (result.success) {
      setErrors({});
      return true;
    }
    const errs: Errors = {};
    result.error.issues.forEach((e) => {
      const key = e.path[0] as keyof FormData;
      errs[key] = e.message;
    });
    setErrors(errs);
    return false;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
    setTimeout(() => router.push("/dashboard/events"), 2000);
  }

  if (submitted) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="size-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-4xl text-emerald-600">check_circle</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900">¡Evento creado con éxito!</h2>
          <p className="text-slate-500">Redirigiendo a la gestión de eventos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/events"
          className="size-10 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-[#f49d25] transition-colors"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
        </Link>
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Crear Nuevo Evento</h2>
          <p className="text-slate-500 mt-0.5">Completa la información para publicar tu evento.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Voluntarios necesarios" error={errors.volunteersNeeded} required>
              <input
                type="number"
                min={1}
                placeholder="Ej: 30"
                value={form.volunteersNeeded ?? ""}
                onChange={(e) => set("volunteersNeeded", parseInt(e.target.value))}
                className={inputClass(!!errors.volunteersNeeded)}
              />
            </Field>

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

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard/events"
            className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </Link>
          <div className="flex gap-3">
            <button
              type="button"
              className="px-6 py-3 rounded-xl border border-[#f49d25] text-[#f49d25] font-bold hover:bg-[#f49d25]/5 transition-colors"
            >
              Guardar borrador
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#f49d25] text-white font-bold shadow-lg shadow-[#f49d25]/20 hover:brightness-105 transition-all"
            >
              <span className="material-symbols-outlined text-sm">publish</span>
              Publicar Evento
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
