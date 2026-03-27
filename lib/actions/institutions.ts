"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/auth";
import { getUserProfile } from "@/lib/queries";
import { canManageInstitution } from "@/lib/authorization";

export async function createInstitution(data: {
  name: string;
  type: "colegio" | "universidad" | "centro_comunitario" | "ong" | "centro_educativo";
  city: string;
  contact: string;
  email: string;
}) {
  const user = await getAuthUser();
  if (!user) return { error: "No autenticado" };

  if (!data.name || data.name.trim().length < 2) return { error: "El nombre debe tener al menos 2 caracteres" };
  if (!data.city || data.city.trim().length < 2) return { error: "La ciudad debe tener al menos 2 caracteres" };
  if (!data.contact || data.contact.trim().length < 2) return { error: "El contacto debe tener al menos 2 caracteres" };
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) return { error: "El email no es valido" };

  const supabase = await createSupabaseServer();

  const { error } = await supabase.from("institutions").insert({
    name: data.name.trim(),
    type: data.type,
    city: data.city.trim(),
    contact: data.contact.trim(),
    email: data.email.trim(),
    status: "solicitud",
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/institutions");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateInstitution(
  id: string,
  data: {
    name: string;
    type: "colegio" | "universidad" | "centro_comunitario" | "ong" | "centro_educativo";
    city: string;
    contact: string;
    email: string;
  }
) {
  const user = await getAuthUser();
  if (!user) return { error: "No autenticado" };

  if (!data.name || data.name.trim().length < 2) return { error: "El nombre debe tener al menos 2 caracteres" };
  if (!data.city || data.city.trim().length < 2) return { error: "La ciudad debe tener al menos 2 caracteres" };
  if (!data.contact || data.contact.trim().length < 2) return { error: "El contacto debe tener al menos 2 caracteres" };
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) return { error: "El email no es valido" };

  const allowed = await canManageInstitution(user.id, id);
  if (!allowed) return { error: "No autorizado" };

  const supabase = await createSupabaseServer();

  const { error } = await supabase
    .from("institutions")
    .update({
      name: data.name.trim(),
      type: data.type,
      city: data.city.trim(),
      contact: data.contact.trim(),
      email: data.email.trim(),
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/institutions");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteInstitution(id: string) {
  const user = await getAuthUser();
  if (!user) return { error: "No autenticado" };

  const allowed = await canManageInstitution(user.id, id);
  if (!allowed) return { error: "No autorizado" };

  const supabase = await createSupabaseServer();

  const { data: events, error: eventsError } = await supabase
    .from("events")
    .select("id")
    .eq("institution_id", id)
    .limit(1);

  if (eventsError) return { error: eventsError.message };

  if (events && events.length > 0) {
    return { error: "No se puede eliminar una institucion con eventos asociados" };
  }

  const { error } = await supabase
    .from("institutions")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/institutions");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateInstitutionStatus(
  id: string,
  status: "activo" | "inactivo" | "solicitud"
) {
  const user = await getAuthUser();
  if (!user) return { error: "No autenticado" };

  const allowed = await canManageInstitution(user.id, id);
  if (!allowed) return { error: "No autorizado" };

  const supabase = await createSupabaseServer();

  const { error } = await supabase
    .from("institutions")
    .update({ status })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/institutions");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function linkInstitutionUser(institutionId: string, targetUserId: string) {
  const user = await getAuthUser();
  if (!user) return { error: "No autenticado" };

  const profile = await getUserProfile(user.id);
  if (!profile || profile.role !== "admin") return { error: "No autorizado" };

  const supabase = await createSupabaseServer();

  const { error } = await supabase
    .from("institutions")
    .update({ contact_user_id: targetUserId })
    .eq("id", institutionId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/institutions");
  return { success: true };
}
