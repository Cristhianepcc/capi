"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "@/lib/supabase/server";
import { eventSchema, agendaItemSchema, type EventFormData } from "@/lib/validations";
import { getAuthUser } from "@/lib/auth";
import { canManageEvent, canDeleteEvent, canCreateEventInCommunity } from "@/lib/authorization";
import { sanitizeHtml } from "@/lib/sanitize";

const TYPE_MAP: Record<string, string> = {
  Taller: "taller",
  Conferencia: "conferencia",
  Charla: "charla",
  Programa: "programa",
  "Voluntariado Educativo": "voluntariado_educativo",
  "Evento STEM": "evento_stem",
  "Actividad Comunitaria": "evento_stem",
};

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

type RegistrationFieldInput = {
  fieldKey: string;
  fieldLabel: string;
  fieldType: string;
  required: boolean;
  placeholder?: string;
  optionsJson?: string[];
  sortOrder: number;
};

async function saveRegistrationFields(
  supabase: Awaited<ReturnType<typeof createSupabaseServer>>,
  eventId: string,
  fields: RegistrationFieldInput[]
) {
  // Delete existing fields
  await supabase
    .from("event_registration_fields")
    .delete()
    .eq("event_id", eventId);

  if (fields.length === 0) return null;

  const rows = fields.map((f) => ({
    event_id: eventId,
    field_key: f.fieldKey,
    field_label: sanitizeHtml(f.fieldLabel),
    field_type: f.fieldType,
    required: f.required,
    placeholder: f.placeholder ? sanitizeHtml(f.placeholder) : null,
    options_json: f.optionsJson ?? null,
    sort_order: f.sortOrder,
  }));

  const { error } = await supabase
    .from("event_registration_fields")
    .insert(rows as any);

  return error;
}

export async function createEvent(
  formData: EventFormData,
  status: "activo" | "borrador" = "activo",
  agenda?: { time: string; title: string; description?: string }[],
  communityId?: string,
  registrationFields?: RegistrationFieldInput[]
) {
  const user = await getAuthUser();
  if (!user) return { error: "No autenticado" };

  if (!communityId) return { error: "Debes seleccionar una comunidad" };

  const allowed = await canCreateEventInCommunity(user.id, communityId);
  if (!allowed) return { error: "No tienes permisos para crear eventos en esta comunidad" };

  const parsed = eventSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues.map((i) => i.message).join(", ") };
  }

  const supabase = await createSupabaseServer();
  const data = parsed.data;
  data.title = sanitizeHtml(data.title);
  data.description = sanitizeHtml(data.description);
  data.about = sanitizeHtml(data.about);
  const slug = toSlug(data.title) + "-" + Date.now().toString(36);
  const dbType = TYPE_MAP[data.type] ?? "taller";
  const volunteersNeeded = data.roles.reduce((s, r) => s + r.slots, 0);

  // Find or create institution
  let { data: institution } = await supabase
    .from("institutions")
    .select("id")
    .eq("name", data.institution)
    .single();

  if (!institution) {
    const { data: newInst, error: instErr } = await supabase
      .from("institutions")
      .insert({
        name: data.institution,
        type: "centro_educativo",
        city: data.location,
        contact: "",
        email: "",
        status: "solicitud",
      })
      .select("id")
      .single();
    if (instErr) return { error: instErr.message };
    institution = newInst;
  }

  // Insert event
  const { data: event, error: eventErr } = await supabase
    .from("events")
    .insert({
      title: data.title,
      slug,
      description: data.description,
      about: data.about,
      date: data.date,
      location: data.location,
      full_location: data.fullLocation,
      type: dbType as "taller",
      status,
      institution_id: institution!.id,
      community_id: communityId,
      volunteers_needed: volunteersNeeded,
      students_goal: data.studentsGoal,
      image_url: data.imageUrl || null,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (eventErr) return { error: eventErr.message };

  // Insert event roles
  const roleRows = data.roles.map((r, index) => ({
    event_id: event!.id,
    name: r.name,
    slots: r.slots,
    sort_order: index,
  }));

  const { error: rolesErr } = await supabase
    .from("event_roles")
    .insert(roleRows);

  if (rolesErr) return { error: rolesErr.message };

  // Handle sponsors
  const sponsorWarnings: string[] = [];
  if (data.sponsors.trim()) {
    const sponsorNames = data.sponsors.split(",").map((s) => s.trim()).filter(Boolean);
    for (const name of sponsorNames) {
      let { data: sponsor } = await supabase
        .from("sponsors")
        .select("id")
        .eq("name", name)
        .single();

      if (!sponsor) {
        const { data: newSponsor, error: sponsorErr } = await supabase
          .from("sponsors")
          .insert({ name })
          .select("id")
          .single();
        if (sponsorErr) {
          sponsorWarnings.push(`No se pudo crear sponsor "${name}"`);
          continue;
        }
        sponsor = newSponsor;
      }

      if (sponsor) {
        const { error: linkErr } = await supabase
          .from("event_sponsors")
          .insert({ event_id: event!.id, sponsor_id: sponsor.id });
        if (linkErr) {
          sponsorWarnings.push(`No se pudo vincular sponsor "${name}"`);
        }
      }
    }
  }

  // Handle agenda items
  if (agenda && agenda.length > 0) {
    const validatedAgenda = agenda.map((item) => agendaItemSchema.safeParse(item));
    const invalidItem = validatedAgenda.find((r) => !r.success);
    if (invalidItem && !invalidItem.success) {
      return { error: invalidItem.error.issues.map((i) => i.message).join(", ") };
    }

    const agendaRows = agenda.map((item, index) => ({
      event_id: event!.id,
      time: item.time,
      title: item.title,
      description: item.description ?? "",
      sort_order: index,
    }));

    const { error: agendaErr } = await supabase
      .from("agenda_items")
      .insert(agendaRows);

    if (agendaErr) return { error: agendaErr.message };
  }

  // Handle registration fields
  if (registrationFields) {
    const fieldsErr = await saveRegistrationFields(supabase, event!.id, registrationFields);
    if (fieldsErr) return { error: fieldsErr.message };
  }

  revalidatePath("/dashboard/events");
  revalidatePath("/events");
  return { success: true, slug, warnings: sponsorWarnings.length > 0 ? sponsorWarnings : undefined };
}

export async function updateEvent(id: string, formData: EventFormData, agenda?: { time: string; title: string; description?: string }[], registrationFields?: RegistrationFieldInput[]) {
  const user = await getAuthUser();
  if (!user) return { error: "No autenticado" };

  const parsed = eventSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues.map((i) => i.message).join(", ") };
  }

  const allowed = await canManageEvent(user.id, id);
  if (!allowed) return { error: "No tienes permisos para editar este evento" };

  const supabase = await createSupabaseServer();

  const data = parsed.data;
  data.title = sanitizeHtml(data.title);
  data.description = sanitizeHtml(data.description);
  data.about = sanitizeHtml(data.about);
  const dbType = TYPE_MAP[data.type] ?? "taller";
  const volunteersNeeded = data.roles.reduce((s, r) => s + r.slots, 0);

  const { error } = await supabase
    .from("events")
    .update({
      title: data.title,
      description: data.description,
      about: data.about,
      date: data.date,
      location: data.location,
      full_location: data.fullLocation,
      type: dbType as "taller",
      volunteers_needed: volunteersNeeded,
      students_goal: data.studentsGoal,
      image_url: data.imageUrl || null,
    })
    .eq("id", id);

  if (error) return { error: error.message };

  // Update event roles: clear and re-insert
  await supabase.from("event_roles").delete().eq("event_id", id);

  const roleRows = data.roles.map((r, index) => ({
    event_id: id,
    name: r.name,
    slots: r.slots,
    sort_order: index,
  }));

  const { error: rolesErr } = await supabase
    .from("event_roles")
    .insert(roleRows);

  if (rolesErr) return { error: rolesErr.message };

  // Update sponsors: clear and re-insert
  const updateSponsorWarnings: string[] = [];
  await supabase.from("event_sponsors").delete().eq("event_id", id);
  if (data.sponsors.trim()) {
    const sponsorNames = data.sponsors.split(",").map((s) => s.trim()).filter(Boolean);
    for (const name of sponsorNames) {
      let { data: sponsor } = await supabase
        .from("sponsors")
        .select("id")
        .eq("name", name)
        .single();

      if (!sponsor) {
        const { data: newSponsor, error: sponsorErr } = await supabase
          .from("sponsors")
          .insert({ name })
          .select("id")
          .single();
        if (sponsorErr) {
          updateSponsorWarnings.push(`No se pudo crear sponsor "${name}"`);
          continue;
        }
        sponsor = newSponsor;
      }

      if (sponsor) {
        const { error: linkErr } = await supabase
          .from("event_sponsors")
          .insert({ event_id: id, sponsor_id: sponsor.id });
        if (linkErr) {
          updateSponsorWarnings.push(`No se pudo vincular sponsor "${name}"`);
        }
      }
    }
  }

  // Handle agenda items: delete existing, then re-insert
  if (agenda) {
    await supabase.from("agenda_items").delete().eq("event_id", id);

    if (agenda.length > 0) {
      const validatedAgenda = agenda.map((item) => agendaItemSchema.safeParse(item));
      const invalidItem = validatedAgenda.find((r) => !r.success);
      if (invalidItem && !invalidItem.success) {
        return { error: invalidItem.error.issues.map((i) => i.message).join(", ") };
      }

      const agendaRows = agenda.map((item, index) => ({
        event_id: id,
        time: item.time,
        title: item.title,
        description: item.description ?? "",
        sort_order: index,
      }));

      const { error: agendaErr } = await supabase
        .from("agenda_items")
        .insert(agendaRows);

      if (agendaErr) return { error: agendaErr.message };
    }
  }

  // Handle registration fields
  if (registrationFields) {
    const fieldsErr = await saveRegistrationFields(supabase, id, registrationFields);
    if (fieldsErr) return { error: fieldsErr.message };
  }

  revalidatePath("/dashboard/events");
  revalidatePath("/events");
  return { success: true, warnings: updateSponsorWarnings.length > 0 ? updateSponsorWarnings : undefined };
}

export async function deleteEvent(id: string) {
  const user = await getAuthUser();
  if (!user) return { error: "No autenticado" };

  const allowed = await canDeleteEvent(user.id, id);
  if (!allowed) return { error: "No tienes permisos para eliminar este evento" };

  const supabase = await createSupabaseServer();

  const { error } = await supabase
    .from("events")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/dashboard/events");
  revalidatePath("/events");
  return { success: true };
}

export async function updateEventStatus(id: string, status: "activo" | "borrador" | "finalizado") {
  const user = await getAuthUser();
  if (!user) return { error: "No autenticado" };

  const allowed = await canManageEvent(user.id, id);
  if (!allowed) return { error: "No tienes permisos para cambiar el estado de este evento" };

  const supabase = await createSupabaseServer();

  const { error } = await supabase
    .from("events")
    .update({ status })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/events");
  revalidatePath("/events");
  return { success: true };
}

export async function updateEventRegistrationFields(eventId: string, fields: RegistrationFieldInput[]) {
  const user = await getAuthUser();
  if (!user) return { error: "No autenticado" };

  const allowed = await canManageEvent(user.id, eventId);
  if (!allowed) return { error: "No tienes permisos para configurar este evento" };

  const supabase = await createSupabaseServer();

  const fieldsErr = await saveRegistrationFields(supabase, eventId, fields);
  if (fieldsErr) return { error: fieldsErr.message };

  revalidatePath("/dashboard/events");
  revalidatePath(`/events`);
  return { success: true };
}
