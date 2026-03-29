"use client";

import { useState } from "react";
import { signupVolunteer } from "@/lib/actions/signup";
import { useToast } from "@/lib/useToast";

interface RegField {
  fieldKey: string;
  fieldLabel: string;
  fieldType: string;
  required: boolean;
  placeholder: string | null;
  optionsJson: string[];
}

interface InscriptionFormProps {
  eventId: string;
  eventSlug: string;
  roles: { name: string; slots: number }[];
  regFields: RegField[];
}

export default function InscriptionForm({
  eventId,
  eventSlug,
  roles,
  regFields,
}: InscriptionFormProps) {
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(roles[0]?.name ?? "");
  const [extraData, setExtraData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function validate(): string | null {
    if (name.trim().length < 2) {
      return "El nombre debe tener al menos 2 caracteres";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Email inválido";
    }
    if (!role) {
      return "Selecciona un rol";
    }

    for (const field of regFields) {
      if (field.required) {
        const val = extraData[field.fieldKey] ?? "";
        if (val.trim() === "") {
          return `El campo "${field.fieldLabel}" es obligatorio`;
        }
      }
    }

    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setLoading(true);

    const result = await signupVolunteer({
      eventId,
      name,
      email,
      role,
      extraData,
    });

    setLoading(false);

    if (result.error) {
      setError(result.error);
      showToast(result.error, "error");
      return;
    }

    setSuccess(true);
    showToast("¡Inscripción completada exitosamente!", "success");
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center space-y-3">
        <div className="size-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-3xl text-emerald-600">check_circle</span>
        </div>
        <h2 className="text-lg font-bold text-emerald-800">¡Inscripción Completada!</h2>
        <p className="text-sm text-emerald-700">
          Tu solicitud ha sido registrada correctamente. Los organizadores del evento revisarán tu inscripción.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 flex items-start gap-2">
          <span className="material-symbols-outlined text-base flex-shrink-0 mt-0.5">error</span>
          <span>{error}</span>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm space-y-5">
        {/* Name field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">
            Nombre Completo <span className="text-[#f49d25]">*</span>
          </label>
          <input
            type="text"
            placeholder="Ej: Juan Pérez"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#f49d25]/30 focus:border-[#f49d25]"
          />
        </div>

        {/* Email field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">
            Email <span className="text-[#f49d25]">*</span>
          </label>
          <input
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#f49d25]/30 focus:border-[#f49d25]"
          />
        </div>

        {/* Role field */}
        {roles.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Rol Preferido <span className="text-[#f49d25]">*</span>
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#f49d25]/30 focus:border-[#f49d25]"
            >
              <option value="">Selecciona un rol</option>
              {roles.map((r) => (
                <option key={r.name} value={r.name}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Dynamic fields */}
        {regFields.map((field) => (
          <div key={field.fieldKey} className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              {field.fieldLabel}
              {field.required && <span className="text-[#f49d25]">*</span>}
            </label>
            {renderField(field, extraData, setExtraData)}
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl bg-[#f49d25] text-white font-bold shadow-lg shadow-[#f49d25]/20 hover:brightness-105 transition-all disabled:opacity-50"
      >
        {loading ? "Enviando..." : "Enviar Inscripción"}
      </button>
    </form>
  );
}

function renderField(
  field: RegField,
  extraData: Record<string, string>,
  setExtraData: (data: Record<string, string>) => void
) {
  const value = extraData[field.fieldKey] ?? "";
  const setter = (val: string) =>
    setExtraData({ ...extraData, [field.fieldKey]: val });

  const inputBase =
    "w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#f49d25]/30 focus:border-[#f49d25]";

  switch (field.fieldType) {
    case "text":
    case "email":
    case "phone":
      return (
        <input
          type={field.fieldType === "phone" ? "tel" : field.fieldType}
          value={value}
          onChange={(e) => setter(e.target.value)}
          placeholder={field.placeholder ?? ""}
          required={field.required}
          className={inputBase}
        />
      );

    case "textarea":
      return (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => setter(e.target.value)}
          placeholder={field.placeholder ?? ""}
          required={field.required}
          className={inputBase}
        />
      );

    case "select":
      return (
        <select
          value={value}
          onChange={(e) => setter(e.target.value)}
          required={field.required}
          className={inputBase}
        >
          <option value="">Seleccionar...</option>
          {field.optionsJson.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );

    case "checkbox":
      return (
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={value === "true"}
            onChange={(e) => setter(e.target.checked ? "true" : "")}
            className="size-4 rounded border-slate-300 accent-[#f49d25]"
          />
          <span className="text-sm text-slate-600">
            {field.placeholder || field.fieldLabel}
          </span>
        </label>
      );

    default:
      return null;
  }
}
