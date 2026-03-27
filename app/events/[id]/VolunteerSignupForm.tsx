"use client";

import { useState } from "react";
import { signupVolunteer } from "@/lib/actions/signup";

interface EventRole {
  name: string;
  slots: number;
}

interface VolunteerSignupFormProps {
  eventId: string;
  roles: EventRole[];
}

export default function VolunteerSignupForm({ eventId, roles }: VolunteerSignupFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(roles[0]?.name ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signupVolunteer({ eventId, name, email, role });

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center space-y-3">
        <div className="size-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-2xl text-emerald-600">check_circle</span>
        </div>
        <h3 className="text-lg font-bold text-emerald-800">¡Postulación enviada!</h3>
        <p className="text-sm text-emerald-600">
          Tu postulación está pendiente de aprobación. Te notificaremos cuando sea revisada.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#f49d25]/10 bg-white p-8 shadow-sm">
      <h3 className="text-xl font-bold mb-2 text-slate-900">Postularme como Voluntario</h3>
      <p className="text-sm text-slate-500 mb-6">Completa tus datos para inscribirte en este evento.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700">Nombre completo</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre completo"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#f49d25]/30 focus:border-[#f49d25]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#f49d25]/30 focus:border-[#f49d25]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700">Rol preferido</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#f49d25]/30 focus:border-[#f49d25]"
          >
            {roles.map((r) => (
              <option key={r.name} value={r.name}>{r.name}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#f49d25] px-6 py-3 font-bold text-white shadow-lg shadow-[#f49d25]/20 hover:brightness-105 transition-all disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-sm">volunteer_activism</span>
          {loading ? "Enviando..." : "Enviar Postulación"}
        </button>
      </form>
    </div>
  );
}
