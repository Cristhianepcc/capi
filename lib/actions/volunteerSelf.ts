"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/auth";

export async function cancelApplication(eventVolunteerId: string) {
  const user = await getAuthUser();
  if (!user) return { error: "No autenticado" };

  const supabase = await createSupabaseServer();

  // Verify the volunteer owns this application via user_id
  const { data: ev } = await supabase
    .from("event_volunteers")
    .select("id, status, volunteer_id, event_id, volunteers!inner(user_id), events!inner(date)")
    .eq("id", eventVolunteerId)
    .single();

  if (!ev) return { error: "Registro no encontrado" };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const volunteerUserId = (ev.volunteers as any).user_id;
  if (volunteerUserId !== user.id) return { error: "No autorizado" };

  if (ev.status !== "pendiente") {
    return { error: "Solo puedes cancelar postulaciones pendientes" };
  }

  // Check event is in the future
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const eventDate = new Date((ev.events as any).date);
  if (eventDate < new Date()) {
    return { error: "No puedes cancelar una postulación a un evento pasado" };
  }

  const { error } = await supabase
    .from("event_volunteers")
    .delete()
    .eq("id", eventVolunteerId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/my-events");
  revalidatePath("/dashboard");
  return { success: true };
}
