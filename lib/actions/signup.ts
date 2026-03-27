"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "@/lib/supabase/server";
import { volunteerSignupSchema } from "@/lib/validations";
import { checkRateLimit } from "@/lib/rateLimit";
import { sanitizeHtml } from "@/lib/sanitize";

const AVATAR_COLORS = [
  "bg-amber-400",
  "bg-orange-400",
  "bg-yellow-500",
  "bg-emerald-400",
  "bg-cyan-400",
  "bg-blue-400",
  "bg-purple-400",
  "bg-pink-400",
  "bg-rose-400",
  "bg-teal-400",
];

const HEX_MAP: Record<string, string> = {
  "bg-amber-400": "#fbbf24",
  "bg-orange-400": "#fb923c",
  "bg-yellow-500": "#eab308",
  "bg-emerald-400": "#34d399",
  "bg-cyan-400": "#22d3ee",
  "bg-blue-400": "#60a5fa",
  "bg-purple-400": "#c084fc",
  "bg-pink-400": "#f472b6",
  "bg-rose-400": "#fb7185",
  "bg-teal-400": "#2dd4bf",
};

export async function signupVolunteer(data: {
  eventId: string;
  name: string;
  email: string;
  role: string;
  extraData?: Record<string, string>;
}) {
  const parsed = volunteerSignupSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues.map((i) => i.message).join(", ") };
  }

  // Rate limit: max 5 signups per email per 15 minutes
  const { allowed } = checkRateLimit(`signup:${data.email}`, 5, 15 * 60 * 1000);
  if (!allowed) {
    return { error: "Demasiadas solicitudes. Intenta de nuevo más tarde." };
  }

  const supabase = await createSupabaseServer();

  // Validate event capacity
  const { data: eventData } = await supabase
    .from("events")
    .select("volunteers_needed")
    .eq("id", data.eventId)
    .single();

  if (!eventData) return { error: "Evento no encontrado" };

  // Validate role exists for this event
  const { data: eventRoles } = await supabase
    .from("event_roles")
    .select("name")
    .eq("event_id", data.eventId);

  const validRoleNames = (eventRoles ?? []).map((r) => r.name);
  if (validRoleNames.length > 0 && !validRoleNames.includes(data.role)) {
    return { error: "El rol seleccionado no está disponible para este evento" };
  }

  const { count: approvedCount } = await supabase
    .from("event_volunteers")
    .select("id", { count: "exact", head: true })
    .eq("event_id", data.eventId)
    .eq("status", "aprobado");

  if (approvedCount !== null && approvedCount >= eventData.volunteers_needed) {
    return { error: "Este evento ya alcanzó su capacidad de voluntarios" };
  }

  // Check if already signed up for this event
  const { data: existing } = await supabase
    .from("volunteers")
    .select("id")
    .eq("email", data.email)
    .single();

  let volunteerId: string;

  if (existing) {
    volunteerId = existing.id;

    // Check if already enrolled in this event
    const { data: enrolled } = await supabase
      .from("event_volunteers")
      .select("id")
      .eq("volunteer_id", volunteerId)
      .eq("event_id", data.eventId)
      .single();

    if (enrolled) {
      return { error: "Ya estás inscrito en este evento" };
    }
  } else {
    const color = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
    const { data: newVol, error: volErr } = await supabase
      .from("volunteers")
      .insert({
        name: sanitizeHtml(data.name),
        email: data.email,
        avatar_color: color,
        avatar_hex: HEX_MAP[color] ?? "#94a3b8",
      })
      .select("id")
      .single();

    if (volErr) return { error: volErr.message };
    volunteerId = newVol!.id;
  }

  // Link volunteer with authenticated user if available
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (authUser) {
    await supabase
      .from("volunteers")
      .update({ user_id: authUser.id })
      .eq("id", volunteerId)
      .is("user_id", null);
  }

  // Validate required registration fields
  if (data.extraData !== undefined) {
    const { data: regFields } = await supabase
      .from("event_registration_fields")
      .select("field_key, field_label, required")
      .eq("event_id", data.eventId);

    for (const field of regFields as any[] ?? []) {
      if (field.required) {
        const val = data.extraData?.[field.field_key];
        if (!val || val.trim() === "") {
          return { error: `El campo "${field.field_label}" es obligatorio` };
        }
      }
    }
  }

  const { error: evErr } = await supabase.from("event_volunteers").insert({
    event_id: data.eventId,
    volunteer_id: volunteerId,
    role: data.role,
    status: "pendiente",
    extra_data: data.extraData ?? null,
  });

  if (evErr) return { error: evErr.message };

  revalidatePath(`/events/${data.eventId}`);
  revalidatePath("/dashboard/volunteers");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/my-events");
  return { success: true };
}
