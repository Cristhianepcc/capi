"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/auth";
import { canManageCommunity, CommunityPermission, hasPermission, isSystemAdmin } from "@/lib/authorization";

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export interface CommunityFormData {
  name: string;
  description?: string;
  website?: string;
  logoUrl?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  github?: string;
  discord?: string;
}

export async function createCommunity(data: CommunityFormData) {
  const user = await getAuthUser();
  if (!user) return { error: "No autenticado" };

  if (!data.name || data.name.trim().length < 2) {
    return { error: "El nombre debe tener al menos 2 caracteres" };
  }

  const supabase = await createSupabaseServer();
  const slug = toSlug(data.name.trim()) + "-" + Date.now().toString(36);

  const { data: community, error } = await supabase
    .from("communities")
    .insert({
      name: data.name.trim(),
      slug,
      description: data.description?.trim() || null,
      logo_url: data.logoUrl?.trim() || null,
      website: data.website?.trim() || null,
      instagram: data.instagram?.trim() || null,
      twitter: data.twitter?.trim() || null,
      linkedin: data.linkedin?.trim() || null,
      github: data.github?.trim() || null,
      discord: data.discord?.trim() || null,
      created_by: user.id,
      status: "solicitud",
    })
    .select("id, slug")
    .single();

  if (error) {
    if (error.code === "23505") return { error: "Ya existe una comunidad con ese nombre" };
    return { error: error.message };
  }

  revalidatePath("/dashboard/communities");
  revalidatePath("/dashboard");
  return { success: true, pending: true };
}

export async function updateCommunity(
  communityId: string,
  data: Partial<CommunityFormData>
) {
  const user = await getAuthUser();
  if (!user) return { error: "No autenticado" };

  const allowed = await canManageCommunity(user.id, communityId);
  if (!allowed) return { error: "No autorizado" };

  const supabase = await createSupabaseServer();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updates: any = {};
  if (data.name !== undefined) updates.name = data.name.trim();
  if (data.description !== undefined) updates.description = data.description.trim() || null;
  if (data.logoUrl !== undefined) updates.logo_url = data.logoUrl.trim() || null;
  if (data.website !== undefined) updates.website = data.website.trim() || null;
  if (data.instagram !== undefined) updates.instagram = data.instagram.trim() || null;
  if (data.twitter !== undefined) updates.twitter = data.twitter.trim() || null;
  if (data.linkedin !== undefined) updates.linkedin = data.linkedin.trim() || null;
  if (data.github !== undefined) updates.github = data.github.trim() || null;
  if (data.discord !== undefined) updates.discord = data.discord.trim() || null;
  updates.updated_at = new Date().toISOString();

  const { error } = await supabase
    .from("communities")
    .update(updates)
    .eq("id", communityId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/communities");
  return { success: true };
}

export async function inviteMember(
  communityId: string,
  email: string,
  roleId: string
) {
  const user = await getAuthUser();
  if (!user) return { error: "No autenticado" };

  // Check if user has manage_members permission
  const hasManagePermission = await hasPermission(user.id, communityId, "manage_members");
  if (!hasManagePermission) return { error: "No autorizado para invitar miembros" };

  const supabase = await createSupabaseServer();

  // Verify the role exists in this community
  const { data: role, error: roleError } = await supabase
    .from("community_roles")
    .select("id, is_owner")
    .eq("id", roleId)
    .eq("community_id", communityId)
    .single();

  if (roleError || !role) {
    return { error: "El rol especificado no existe en esta comunidad" };
  }

  // Prevent assigning is_owner role (only system admin can do this)
  if (role.is_owner) {
    return { error: "No puedes asignar este rol manualmente" };
  }

  // Find user by email via auth.users (using RPC function)
  const { data: targetUserId } = await supabase.rpc("find_user_id_by_email", {
    lookup_email: email,
  });

  if (!targetUserId) {
    return { error: `No se encontro un usuario registrado con el email ${email}` };
  }

  if (targetUserId === user.id) {
    return { error: "No puedes invitarte a ti mismo" };
  }

  const { error } = await supabase.from("community_members").insert({
    community_id: communityId,
    user_id: targetUserId,
    community_role_id: roleId,
    invited_by: user.id,
  });

  if (error) {
    if (error.code === "23505") return { error: "Este usuario ya es miembro de la comunidad" };
    return { error: error.message };
  }

  revalidatePath("/dashboard/communities");
  return { success: true };
}

export async function removeMember(communityId: string, targetUserId: string) {
  const user = await getAuthUser();
  if (!user) return { error: "No autenticado" };

  const allowed = await hasPermission(user.id, communityId, "manage_members");
  if (!allowed) return { error: "No tienes permiso para remover miembros" };

  if (targetUserId === user.id) {
    return { error: "Usa 'Salir de comunidad' para dejarlo" };
  }

  const supabase = await createSupabaseServer();

  // Check if member has is_owner role - prevent removal of owner
  const { data: member, error: memberError } = await supabase
    .from("community_members")
    .select("community_roles!inner(is_owner)")
    .eq("community_id", communityId)
    .eq("user_id", targetUserId)
    .single();

  if (memberError || !member) {
    return { error: "Miembro no encontrado" };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((member as any).community_roles?.is_owner) {
    return { error: "No puedes remover al fundador de la comunidad" };
  }

  const { error } = await supabase
    .from("community_members")
    .delete()
    .eq("community_id", communityId)
    .eq("user_id", targetUserId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/communities");
  return { success: true };
}

export async function changeMemberRole(
  communityId: string,
  targetUserId: string,
  newRoleId: string
) {
  const user = await getAuthUser();
  if (!user) return { error: "No autenticado" };

  const allowed = await hasPermission(user.id, communityId, "manage_members");
  if (!allowed) return { error: "No tienes permiso para cambiar roles" };

  const supabase = await createSupabaseServer();

  // Verify the new role exists in this community
  const { data: newRole, error: roleError } = await supabase
    .from("community_roles")
    .select("id, is_owner")
    .eq("id", newRoleId)
    .eq("community_id", communityId)
    .single();

  if (roleError || !newRole) {
    return { error: "El rol especificado no existe en esta comunidad" };
  }

  // Prevent assigning is_owner role
  if (newRole.is_owner) {
    return { error: "No puedes asignar este rol manualmente" };
  }

  // Get current member to check if they have is_owner role
  const { data: member, error: memberError } = await supabase
    .from("community_members")
    .select("community_role_id, community_roles!inner(is_owner)")
    .eq("community_id", communityId)
    .eq("user_id", targetUserId)
    .single();

  if (memberError || !member) {
    return { error: "Miembro no encontrado" };
  }

  // Prevent changing role of owner
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((member as any).community_roles?.is_owner) {
    return { error: "No puedes cambiar el rol del fundador" };
  }

  const { error } = await supabase
    .from("community_members")
    .update({ community_role_id: newRoleId })
    .eq("community_id", communityId)
    .eq("user_id", targetUserId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/communities");
  revalidatePath("/dashboard/permissions");
  return { success: true };
}

export async function leaveCommunity(communityId: string) {
  const user = await getAuthUser();
  if (!user) return { error: "No autenticado" };

  const supabase = await createSupabaseServer();

  // Check if user is the owner (only owner who can have is_owner role)
  const { data: member } = await supabase
    .from("community_members")
    .select("community_roles!inner(is_owner)")
    .eq("community_id", communityId)
    .eq("user_id", user.id)
    .single();

  if (!member) return { error: "No eres miembro de esta comunidad" };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((member as any).community_roles?.is_owner) {
    return { error: "Eres el fundador. Transfiere el liderazgo a otro usuario antes de salir." };
  }

  const { error } = await supabase
    .from("community_members")
    .delete()
    .eq("community_id", communityId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/communities");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function approveCommunityRequest(communityId: string) {
  const user = await getAuthUser();
  if (!user) return { error: "No autenticado" };

  const isAdmin = await isSystemAdmin(user.id);
  console.log(`[approveCommunityRequest] user.id: ${user.id}, isAdmin: ${isAdmin}`);
  if (!isAdmin) return { error: "Solo administradores pueden aprobar solicitudes" };

  const supabase = await createSupabaseServer();

  // Get the community and its creator
  const { data: community, error: fetchError } = await supabase
    .from("communities")
    .select("id, created_by, status")
    .eq("id", communityId)
    .single();

  if (fetchError || !community) return { error: "Comunidad no encontrada" };
  if (community.status !== "solicitud") return { error: "Esta solicitud no está pendiente" };

  // Update status to activo
  const { error: updateError } = await supabase
    .from("communities")
    .update({ status: "activo", rejection_reason: null })
    .eq("id", communityId);

  if (updateError) return { error: updateError.message };

  // Get or create the "Líder" role for this community (should be created by migration)
  let { data: liderRole, error: roleError } = await supabase
    .from("community_roles")
    .select("id")
    .eq("community_id", communityId)
    .eq("is_owner", true)
    .single();

  if (roleError || !liderRole) {
    // If role doesn't exist (shouldn't happen), create it
    const { data: newRole, error: createRoleError } = await supabase
      .from("community_roles")
      .insert({
        community_id: communityId,
        name: "Líder",
        is_owner: true,
      })
      .select("id")
      .single();

    if (createRoleError || !newRole) {
      return { error: "No se pudo crear el rol de líder" };
    }

    liderRole = newRole;
  }

  // Add creator as member with Líder role
  const { error: memberError } = await supabase
    .from("community_members")
    .insert({
      community_id: communityId,
      user_id: community.created_by,
      community_role_id: liderRole.id,
    });

  if (memberError) {
    if (memberError.code !== "23505") {
      return { error: memberError.message };
    }
    // If member already exists, that's OK
  }

  revalidatePath("/dashboard/communities");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function createRole(
  communityId: string,
  name: string,
  description: string | null,
  permissions: string[]
) {
  const user = await getAuthUser();
  if (!user) return { error: "No autenticado" };

  const allowed = await hasPermission(user.id, communityId, "manage_members");
  if (!allowed) return { error: "No tienes permiso para crear roles" };

  if (!name || name.trim().length === 0) {
    return { error: "El nombre del rol es requerido" };
  }

  const supabase = await createSupabaseServer();

  // Create the role
  const { data: role, error: roleError } = await supabase
    .from("community_roles")
    .insert({
      community_id: communityId,
      name: name.trim(),
      description: description?.trim() || null,
      is_owner: false,
    })
    .select("id")
    .single();

  if (roleError) {
    if (roleError.code === "23505") {
      return { error: "Ya existe un rol con ese nombre en la comunidad" };
    }
    return { error: roleError.message };
  }

  // Add permissions to the role
  if (permissions.length > 0) {
    const permissionRecords = permissions.map((perm) => ({
      role_id: role.id,
      permission_key: perm,
    }));

    const { error: permError } = await supabase
      .from("community_role_permissions")
      .insert(permissionRecords);

    if (permError) {
      return { error: permError.message };
    }
  }

  revalidatePath("/dashboard/communities");
  return { success: true, roleId: role.id };
}

export async function updateRole(
  roleId: string,
  name: string,
  description: string | null,
  permissions: string[]
) {
  const user = await getAuthUser();
  if (!user) return { error: "No autenticado" };

  const supabase = await createSupabaseServer();

  // Get the role to verify it exists and get its community_id
  const { data: role, error: roleError } = await supabase
    .from("community_roles")
    .select("community_id, is_owner")
    .eq("id", roleId)
    .single();

  if (roleError || !role) {
    return { error: "Rol no encontrado" };
  }

  // Prevent editing is_owner role
  if (role.is_owner) {
    return { error: "No puedes editar este rol" };
  }

  // Check permission
  const allowed = await hasPermission(user.id, role.community_id, "manage_members");
  if (!allowed) return { error: "No tienes permiso para editar roles" };

  if (!name || name.trim().length === 0) {
    return { error: "El nombre del rol es requerido" };
  }

  // Update the role
  const { error: updateError } = await supabase
    .from("community_roles")
    .update({
      name: name.trim(),
      description: description?.trim() || null,
    })
    .eq("id", roleId);

  if (updateError) {
    if (updateError.code === "23505") {
      return { error: "Ya existe un rol con ese nombre en la comunidad" };
    }
    return { error: updateError.message };
  }

  // Remove old permissions and add new ones
  await supabase
    .from("community_role_permissions")
    .delete()
    .eq("role_id", roleId);

  if (permissions.length > 0) {
    const permissionRecords = permissions.map((perm) => ({
      role_id: roleId,
      permission_key: perm,
    }));

    const { error: permError } = await supabase
      .from("community_role_permissions")
      .insert(permissionRecords);

    if (permError) {
      return { error: permError.message };
    }
  }

  revalidatePath("/dashboard/communities");
  return { success: true };
}

export async function deleteRole(roleId: string) {
  const user = await getAuthUser();
  if (!user) return { error: "No autenticado" };

  const supabase = await createSupabaseServer();

  // Get the role to verify it exists and get its community_id
  const { data: role, error: roleError } = await supabase
    .from("community_roles")
    .select("community_id, is_owner")
    .eq("id", roleId)
    .single();

  if (roleError || !role) {
    return { error: "Rol no encontrado" };
  }

  // Prevent deleting is_owner role
  if (role.is_owner) {
    return { error: "No puedes eliminar este rol" };
  }

  // Check permission
  const allowed = await hasPermission(user.id, role.community_id, "manage_members");
  if (!allowed) return { error: "No tienes permiso para eliminar roles" };

  // Check if role is in use (has members assigned)
  const { count } = await supabase
    .from("community_members")
    .select("id", { count: "exact", head: true })
    .eq("community_role_id", roleId);

  if ((count ?? 0) > 0) {
    return { error: "No puedes eliminar un rol que tiene miembros asignados" };
  }

  // Delete the role (permissions will cascade delete)
  const { error: deleteError } = await supabase
    .from("community_roles")
    .delete()
    .eq("id", roleId);

  if (deleteError) return { error: deleteError.message };

  revalidatePath("/dashboard/communities");
  return { success: true };
}

export async function rejectCommunityRequest(
  communityId: string,
  reason?: string
) {
  const user = await getAuthUser();
  if (!user) return { error: "No autenticado" };

  const isAdmin = await isSystemAdmin(user.id);
  if (!isAdmin) return { error: "Solo administradores pueden rechazar solicitudes" };

  const supabase = await createSupabaseServer();

  // Get the community and check its status
  const { data: community, error: fetchError } = await supabase
    .from("communities")
    .select("id, status")
    .eq("id", communityId)
    .single();

  if (fetchError || !community) return { error: "Comunidad no encontrada" };
  if (community.status !== "solicitud") return { error: "Esta solicitud no está pendiente" };

  // Update status to rechazado
  const { error: updateError } = await supabase
    .from("communities")
    .update({
      status: "rechazado" as any,
      rejection_reason: reason?.trim() || null,
    })
    .eq("id", communityId);

  if (updateError) return { error: updateError.message };

  revalidatePath("/dashboard/communities");
  revalidatePath("/dashboard");
  return { success: true };
}
