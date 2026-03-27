"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/auth";
import { canManageEventVolunteer } from "@/lib/authorization";

export async function updateVolunteerStatus(
  eventVolunteerId: string,
  status: "pendiente" | "aprobado" | "rechazado"
) {
  const user = await getAuthUser();
  if (!user) return { error: "No autenticado" };

  const allowed = await canManageEventVolunteer(user.id, eventVolunteerId);
  if (!allowed) return { error: "No autorizado" };

  const supabase = await createSupabaseServer();
  const { error } = await supabase
    .from("event_volunteers")
    .update({ status })
    .eq("id", eventVolunteerId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/volunteers");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateVolunteerRole(
  eventVolunteerId: string,
  role: string
) {
  const user = await getAuthUser();
  if (!user) return { error: "No autenticado" };

  const allowed = await canManageEventVolunteer(user.id, eventVolunteerId);
  if (!allowed) return { error: "No autorizado" };

  const supabase = await createSupabaseServer();

  // Validate role against event's configured roles
  const { data: ev } = await supabase
    .from("event_volunteers")
    .select("event_id")
    .eq("id", eventVolunteerId)
    .single();

  if (ev) {
    const { data: eventRoles } = await supabase
      .from("event_roles")
      .select("name")
      .eq("event_id", ev.event_id);

    const validRoleNames = (eventRoles ?? []).map((r) => r.name);
    if (validRoleNames.length > 0 && !validRoleNames.includes(role)) {
      return { error: "El rol seleccionado no esta disponible para este evento" };
    }
  }

  const { error } = await supabase
    .from("event_volunteers")
    .update({ role })
    .eq("id", eventVolunteerId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/volunteers");
  return { success: true };
}

export async function updateVolunteerHours(eventVolunteerId: string, hours: number) {
  const user = await getAuthUser();
  if (!user) return { error: "No autenticado" };

  const allowed = await canManageEventVolunteer(user.id, eventVolunteerId);
  if (!allowed) return { error: "No autorizado" };

  const supabase = await createSupabaseServer();
  const { error } = await supabase
    .from("event_volunteers")
    .update({ hours })
    .eq("id", eventVolunteerId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/volunteers");
  return { success: true };
}
