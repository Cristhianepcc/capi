"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/auth";
import { getUserProfile } from "@/lib/queries";

export async function changeUserRole(
  targetUserId: string,
  newRole: "admin" | "user"
) {
  const user = await getAuthUser();
  if (!user) return { error: "No autenticado" };

  const profile = await getUserProfile(user.id);
  if (!profile || profile.role !== "admin") return { error: "No autorizado" };

  if (targetUserId === user.id) return { error: "No puedes cambiar tu propio rol" };

  const supabase = await createSupabaseServer();
  const { error } = await supabase
    .from("user_profiles")
    .update({ role: newRole })
    .eq("id", targetUserId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/users");
  revalidatePath("/dashboard/permissions");
  return { success: true };
}

export async function getAllUsers() {
  const user = await getAuthUser();
  if (!user) return { error: "No autenticado", data: [] };

  const profile = await getUserProfile(user.id);
  if (!profile || profile.role !== "admin") return { error: "No autorizado", data: [] };

  const supabase = await createSupabaseServer();
  const { data, error } = await supabase
    .from("user_profiles")
    .select("id, role, full_name, created_at")
    .order("created_at", { ascending: false });

  if (error) return { error: error.message, data: [] };
  return { data: data ?? [] };
}
