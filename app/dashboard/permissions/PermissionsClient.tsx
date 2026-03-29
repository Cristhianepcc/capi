"use client";

import { useState } from "react";
import { changeUserRole } from "@/lib/actions/users";
import { changeMemberRole } from "@/lib/actions/communities";

interface UserRow {
  id: string;
  role: string;
  full_name: string | null;
  created_at: string;
}

interface CommunityMember {
  id: string;
  userId: string;
  communityRoleId: string;
  roleName: string;
  isOwner: boolean;
  fullName: string;
  joinedAt: string;
}

interface CommunityRole {
  id: string;
  name: string;
  isOwner: boolean;
}

interface CommunityWithMembers {
  id: string;
  name: string;
  slug: string;
  members: CommunityMember[];
  roles: CommunityRole[];
}

interface PermissionsClientProps {
  users: UserRow[];
  communities: CommunityWithMembers[];
  currentUserId: string;
}

const ROLE_LABELS: Record<string, { label: string; bg: string; text: string }> = {
  admin: { label: "Admin", bg: "bg-red-100", text: "text-red-700" },
  user: { label: "Usuario", bg: "bg-blue-100", text: "text-blue-700" },
};

export default function PermissionsClient({
  users,
  communities,
  currentUserId,
}: PermissionsClientProps) {
  const [activeTab, setActiveTab] = useState<"system" | "communities">("system");
  const [usersList, setUsersList] = useState(users);
  const [communitiesList, setCommunitiesList] = useState(communities);
  const [expandedCommunity, setExpandedCommunity] = useState<string | null>(null);
  const [changingUserId, setChangingUserId] = useState<string | null>(null);
  const [changingMemberId, setChangingMemberId] = useState<string | null>(null);

  async function handleSystemRoleChange(userId: string, newRole: "admin" | "user") {
    setChangingUserId(userId);
    const result = await changeUserRole(userId, newRole);
    if (result.error) {
      alert(result.error);
      setChangingUserId(null);
      return;
    }
    setUsersList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    setChangingUserId(null);
  }

  async function handleCommunityMemberRoleChange(
    communityId: string,
    memberId: string,
    newRoleId: string
  ) {
    setChangingMemberId(memberId);
    const result = await changeMemberRole(communityId, memberId, newRoleId);
    if (result.error) {
      alert(result.error);
      setChangingMemberId(null);
      return;
    }

    // Find the new role name
    const community = communitiesList.find((c) => c.id === communityId);
    const newRole = community?.roles.find((r) => r.id === newRoleId);

    setCommunitiesList((prev) =>
      prev.map((c) =>
        c.id === communityId
          ? {
              ...c,
              members: c.members.map((m) =>
                m.id === memberId
                  ? { ...m, communityRoleId: newRoleId, roleName: newRole?.name || m.roleName }
                  : m
              ),
            }
          : c
      )
    );
    setChangingMemberId(null);
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Permisos</h2>
        <p className="text-slate-500 mt-1">Gestiona permisos del sistema y comunidades.</p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("system")}
          className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors ${
            activeTab === "system"
              ? "border-[#f49d25] text-[#f49d25]"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          Roles del Sistema
        </button>
        <button
          onClick={() => setActiveTab("communities")}
          className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors ${
            activeTab === "communities"
              ? "border-[#f49d25] text-[#f49d25]"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          Roles por Comunidad
        </button>
      </div>

      {/* Tab 1: System Roles */}
      {activeTab === "system" && (
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
              {usersList.map((u) => {
                const roleInfo = ROLE_LABELS[u.role] ?? ROLE_LABELS.user;
                const isSelf = u.id === currentUserId;
                return (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {u.full_name || "Sin nombre"}
                        </p>
                        <p className="text-xs text-slate-400">{u.id.slice(0, 8)}...</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${roleInfo.bg} ${roleInfo.text}`}
                      >
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
                            handleSystemRoleChange(u.id, e.target.value as "admin" | "user")
                          }
                          disabled={changingUserId === u.id}
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
      )}

      {/* Tab 2: Community Roles */}
      {activeTab === "communities" && (
        <div className="space-y-4">
          {communitiesList.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
              <p className="text-slate-500">No hay comunidades disponibles.</p>
            </div>
          ) : (
            communitiesList.map((community) => (
              <div key={community.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                {/* Community header */}
                <button
                  onClick={() =>
                    setExpandedCommunity(
                      expandedCommunity === community.id ? null : community.id
                    )
                  }
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors border-b border-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-slate-900">{community.name}</h3>
                    <span className="px-2 py-1 rounded-full text-xs bg-slate-100 text-slate-600">
                      {community.members.length} miembros
                    </span>
                  </div>
                  <span
                    className={`material-symbols-outlined text-slate-400 transition-transform ${
                      expandedCommunity === community.id ? "rotate-180" : ""
                    }`}
                  >
                    expand_more
                  </span>
                </button>

                {/* Community members table (expanded) */}
                {expandedCommunity === community.id && (
                  <div>
                    {community.members.length === 0 ? (
                      <div className="p-6 text-center text-slate-500">
                        No hay miembros en esta comunidad.
                      </div>
                    ) : (
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-100 text-left bg-slate-50">
                            <th className="px-6 py-3 font-semibold text-slate-600">Nombre</th>
                            <th className="px-6 py-3 font-semibold text-slate-600">Rol Actual</th>
                            <th className="px-6 py-3 font-semibold text-slate-600">Uniéndose</th>
                            <th className="px-6 py-3 font-semibold text-slate-600">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {community.members.map((member) => (
                            <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4">
                                <div>
                                  <p className="font-semibold text-slate-900">
                                    {member.fullName}
                                  </p>
                                  <p className="text-xs text-slate-400">
                                    {member.userId.slice(0, 8)}...
                                  </p>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                {member.isOwner ? (
                                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800">
                                    Fundador
                                  </span>
                                ) : (
                                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                                    {member.roleName}
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-slate-500 text-xs">
                                {member.joinedAt}
                              </td>
                              <td className="px-6 py-4">
                                {member.isOwner ? (
                                  <span className="text-xs text-slate-400">Sin cambios</span>
                                ) : (
                                  <select
                                    value={member.communityRoleId}
                                    onChange={(e) =>
                                      handleCommunityMemberRoleChange(
                                        community.id,
                                        member.id,
                                        e.target.value
                                      )
                                    }
                                    disabled={changingMemberId === member.id}
                                    className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#f49d25]/30 focus:border-[#f49d25] disabled:opacity-50"
                                  >
                                    {community.roles
                                      .filter((r) => !r.isOwner)
                                      .map((role) => (
                                        <option key={role.id} value={role.id}>
                                          {role.name}
                                        </option>
                                      ))}
                                  </select>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
