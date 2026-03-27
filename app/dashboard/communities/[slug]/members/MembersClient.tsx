"use client";

import { useState } from "react";
import { inviteMember, removeMember, changeMemberRole } from "@/lib/actions/communities";
import { useToast } from "@/lib/useToast";

interface Member {
  id: string;
  userId: string;
  communityRoleId: string;
  roleName: string;
  isOwner: boolean;
  fullName: string;
  joinedAt: string;
}

interface Role {
  id: string;
  name: string;
  isOwner: boolean;
}

interface MembersClientProps {
  communityId: string;
  initialMembers: Member[];
  availableRoles: Role[];
  canManageMembers: boolean;
}

export default function MembersClient({
  communityId,
  initialMembers,
  availableRoles,
  canManageMembers,
}: MembersClientProps) {
  const [members, setMembers] = useState(initialMembers);
  const [email, setEmail] = useState("");
  const [inviteRoleId, setInviteRoleId] = useState<string>(
    availableRoles.find((r) => !r.isOwner)?.id || ""
  );
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !inviteRoleId) return;

    setLoading(true);
    const result = await inviteMember(communityId, email.trim(), inviteRoleId);
    setLoading(false);

    if (result.error) {
      showToast(result.error, "error");
      return;
    }

    setEmail("");
    showToast("Miembro invitado exitosamente", "success");
    window.location.reload();
  }

  async function handleRemove(userId: string, name: string) {
    if (!confirm(`Remover a ${name} de la comunidad?`)) return;

    const result = await removeMember(communityId, userId);
    if (result.error) {
      showToast(result.error, "error");
      return;
    }
    setMembers((prev) => prev.filter((m) => m.userId !== userId));
    showToast("Miembro removido", "success");
  }

  async function handleChangeRole(userId: string, newRoleId: string) {
    const result = await changeMemberRole(communityId, userId, newRoleId);
    if (result.error) {
      showToast(result.error, "error");
      return;
    }
    const newRole = availableRoles.find((r) => r.id === newRoleId);
    setMembers((prev) =>
      prev.map((m) =>
        m.userId === userId
          ? { ...m, communityRoleId: newRoleId, roleName: newRole?.name || m.roleName }
          : m
      )
    );
    showToast("Rol actualizado", "success");
  }

  // Filter out is_owner roles from the invite dropdown
  const invitableRoles = availableRoles.filter((r) => !r.isOwner);

  return (
    <div className="space-y-6">
      {/* Invite form */}
      {canManageMembers && invitableRoles.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-bold text-lg text-slate-900 mb-4">Invitar Miembro</h3>
          <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email del usuario"
              className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#f49d25]/30 focus:border-[#f49d25]"
            />
            <select
              value={inviteRoleId}
              onChange={(e) => setInviteRoleId(e.target.value)}
              className="px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#f49d25]/30 focus:border-[#f49d25]"
            >
              {invitableRoles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-[#f49d25] text-white font-bold rounded-lg text-sm hover:brightness-105 transition-all disabled:opacity-50"
            >
              {loading ? "Invitando..." : "Invitar"}
            </button>
          </form>
        </div>
      )}

      {/* Members list */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-lg text-slate-900">Miembros ({members.length})</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {members.map((m) => (
            <div key={m.id} className="px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">{m.fullName}</p>
                <p className="text-xs text-slate-500">Desde {m.joinedAt}</p>
              </div>
              <div className="flex items-center gap-3">
                {canManageMembers && !m.isOwner && invitableRoles.length > 0 ? (
                  <select
                    value={m.communityRoleId}
                    onChange={(e) => handleChangeRole(m.userId, e.target.value)}
                    className="text-xs px-2 py-1 rounded border border-slate-200 text-slate-600"
                  >
                    {invitableRoles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-full capitalize ${
                      m.isOwner
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {m.roleName}
                  </span>
                )}
                {canManageMembers && !m.isOwner && (
                  <button
                    onClick={() => handleRemove(m.userId, m.fullName)}
                    className="text-xs text-red-500 hover:text-red-700 font-medium"
                  >
                    Remover
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
