"use client";

import { useState } from "react";
import { createRole, deleteRole, updateRole } from "@/lib/actions/communities";
import { useToast } from "@/lib/useToast";
import { CommunityRole } from "@/types/database";

const AVAILABLE_PERMISSIONS = [
  { key: "manage_community", label: "Editar comunidad" },
  { key: "create_events", label: "Crear eventos" },
  { key: "edit_events", label: "Editar eventos" },
  { key: "delete_events", label: "Eliminar eventos" },
  { key: "manage_members", label: "Gestionar miembros" },
  { key: "manage_volunteers", label: "Gestionar voluntarios" },
];

interface RolesClientProps {
  communityId: string;
  communityName: string;
  initialRoles: Array<CommunityRole & { permissions: string[] }>;
  canManageRoles: boolean;
}

export default function RolesClient({
  communityId,
  communityName,
  initialRoles,
  canManageRoles,
}: RolesClientProps) {
  const [roles, setRoles] = useState(initialRoles);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: new Set<string>(),
  });
  const { showToast } = useToast();

  const handleCreateClick = () => {
    setFormData({ name: "", description: "", permissions: new Set() });
    setShowCreateForm(true);
    setEditingRoleId(null);
  };

  const handleEditClick = (role: (typeof roles)[0]) => {
    if (role.is_owner) return;
    setFormData({
      name: role.name,
      description: role.description || "",
      permissions: new Set(role.permissions),
    });
    setEditingRoleId(role.id);
    setShowCreateForm(false);
  };

  const handleTogglePermission = (permKey: string) => {
    const newPerms = new Set(formData.permissions);
    if (newPerms.has(permKey)) {
      newPerms.delete(permKey);
    } else {
      newPerms.add(permKey);
    }
    setFormData({ ...formData, permissions: newPerms });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showToast("El nombre del rol es requerido", "error");
      return;
    }

    const permissions = Array.from(formData.permissions);

    try {
      if (editingRoleId) {
        // Update existing role
        const result = await updateRole(
          editingRoleId,
          formData.name,
          formData.description || null,
          permissions
        );

        if (result.error) {
          showToast(result.error, "error");
          return;
        }

        // Update local state
        setRoles(
          roles.map((r) =>
            r.id === editingRoleId
              ? {
                  ...r,
                  name: formData.name,
                  description: formData.description || null,
                  permissions,
                }
              : r
          )
        );

        showToast("Rol actualizado correctamente", "success");
      } else {
        // Create new role
        const result = await createRole(communityId, formData.name, formData.description || null, permissions);

        if (result.error) {
          showToast(result.error, "error");
          return;
        }

        // Add to local state
        setRoles([
          ...roles,
          {
            id: result.roleId || "",
            community_id: communityId,
            name: formData.name,
            description: formData.description || null,
            is_owner: false,
            permissions,
            created_at: new Date().toISOString(),
          },
        ]);

        showToast("Rol creado correctamente", "success");
      }

      // Reset form
      setShowCreateForm(false);
      setEditingRoleId(null);
      setFormData({ name: "", description: "", permissions: new Set() });
    } catch (err) {
      showToast("Error al procesar el rol", "error");
    }
  };

  const handleDelete = async (roleId: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este rol?")) return;

    try {
      const result = await deleteRole(roleId);

      if (result.error) {
        showToast(result.error, "error");
        return;
      }

      setRoles(roles.filter((r) => r.id !== roleId));
      showToast("Rol eliminado correctamente", "success");
    } catch (err) {
      showToast("Error al eliminar el rol", "error");
    }
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setEditingRoleId(null);
    setFormData({ name: "", description: "", permissions: new Set() });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Roles de {communityName}</h1>
          <p className="text-gray-500">Gestiona los roles y sus permisos</p>
        </div>
        {!showCreateForm && !editingRoleId && (
          <button
            onClick={handleCreateClick}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            + Crear Rol
          </button>
        )}
      </div>

      {/* Create/Edit Form */}
      {(showCreateForm || editingRoleId) && (
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">
            {editingRoleId ? "Editar rol" : "Crear nuevo rol"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del rol *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="ej: Coordinador"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descripción opcional"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Permissions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Permisos
              </label>
              <div className="space-y-2">
                {AVAILABLE_PERMISSIONS.map((perm) => (
                  <label key={perm.key} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.permissions.has(perm.key)}
                      onChange={() => handleTogglePermission(perm.key)}
                      className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                    />
                    <span className="ml-2 text-sm text-gray-700">{perm.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                {editingRoleId ? "Guardar cambios" : "Crear rol"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Roles List */}
      <div className="space-y-3">
        {roles.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">
            No hay roles en esta comunidad
          </div>
        ) : (
          roles.map((role) => (
            <div
              key={role.id}
              className="bg-white rounded-lg shadow p-6 border border-gray-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{role.name}</h3>
                    {role.is_owner && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded font-medium">
                        Fundador
                      </span>
                    )}
                  </div>
                  {role.description && (
                    <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                  )}
                </div>
                {!role.is_owner && canManageRoles && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(role)}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(role.id)}
                      className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </div>

              {/* Permissions List */}
              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-700 mb-3">Permisos:</p>
                {role.permissions && role.permissions.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {role.permissions.map((perm) => {
                      const permLabel = AVAILABLE_PERMISSIONS.find((p) => p.key === perm);
                      return (
                        <span
                          key={perm}
                          className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded"
                        >
                          {permLabel?.label || perm}
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Sin permisos (solo lectura)</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
