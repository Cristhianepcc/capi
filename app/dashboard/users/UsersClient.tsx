"use client";

import { useState } from "react";
import { changeUserRole } from "@/lib/actions/users";

interface UserRow {
  id: string;
  role: string;
  full_name: string | null;
  created_at: string;
}

const ROLE_LABELS: Record<string, { label: string; bg: string; text: string }> = {
  admin: { label: "Admin", bg: "bg-red-100", text: "text-red-700" },
  user: { label: "Usuario", bg: "bg-blue-100", text: "text-blue-700" },
};

export default function UsersClient({
  users,
  currentUserId,
}: {
  users: UserRow[];
  currentUserId: string;
}) {
  const [items, setItems] = useState(users);
  const [changingId, setChangingId] = useState<string | null>(null);

  async function handleRoleChange(userId: string, newRole: "admin" | "user") {
    setChangingId(userId);
    const result = await changeUserRole(userId, newRole);
    if (result.error) {
      alert(result.error);
      setChangingId(null);
      return;
    }
    setItems((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    setChangingId(null);
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Usuarios</h2>
        <p className="text-slate-500 mt-1">Gestiona los roles de todos los usuarios de la plataforma.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left">
              <th className="px-6 py-4 font-semibold text-slate-500">Nombre</th>
              <th className="px-6 py-4 font-semibold text-slate-500">Rol</th>
              <th className="px-6 py-4 font-semibold text-slate-500">Registrado</th>
              <th className="px-6 py-4 font-semibold text-slate-500">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((u) => {
              const roleInfo = ROLE_LABELS[u.role] ?? ROLE_LABELS.user;
              const isSelf = u.id === currentUserId;
              return (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-slate-900">{u.full_name || "Sin nombre"}</p>
                      <p className="text-xs text-slate-400">{u.id.slice(0, 8)}...</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${roleInfo.bg} ${roleInfo.text}`}>
                      {roleInfo.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(u.created_at).toLocaleDateString("es-PE", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4">
                    {isSelf ? (
                      <span className="text-xs text-slate-400">Tu cuenta</span>
                    ) : (
                      <select
                        value={u.role}
                        onChange={(e) =>
                          handleRoleChange(u.id, e.target.value as "admin" | "user")
                        }
                        disabled={changingId === u.id}
                        className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#f49d25]/30 focus:border-[#f49d25] disabled:opacity-50"
                      >
                        <option value="admin">Admin</option>
                        <option value="user">Usuario</option>
                      </select>
                    )}
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
