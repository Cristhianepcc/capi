"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "@/lib/supabase/server";
import { reviewSchema } from "@/lib/validations";
import { getAuthUser } from "@/lib/auth";
import { getUserProfile } from "@/lib/queries";
import { sanitizeHtml } from "@/lib/sanitize";

export async function createReview(data: {
  eventId: string;
  rating: number;
  comment?: string;
  authorType?: "voluntario" | "institucion";
}) {
  const user = await getAuthUser();
  if (!user) return { error: "Debes iniciar sesion para dejar una resena" };

  const supabase = await createSupabaseServer();
  const authorType = data.authorType ?? "voluntario";

  if (authorType === "institucion") {
    const { data: institution } = await supabase
      .from("institutions")
      .select("id")
      .eq("contact_user_id", user.id)
      .maybeSingle();

    if (!institution) {
      return { error: "No tienes una institucion vinculada" };
    }

    const parsed = reviewSchema.safeParse({
      eventId: data.eventId,
      authorId: institution.id,
      authorType: "institucion",
      rating: data.rating,
      comment: data.comment,
    });
    if (!parsed.success) {
      return { error: parsed.error.issues.map((i) => i.message).join(", ") };
    }

    const sanitizedComment = parsed.data.comment
      ? sanitizeHtml(parsed.data.comment)
      : parsed.data.comment;

    const { error } = await supabase.from("reviews").insert({
      event_id: parsed.data.eventId,
      author_id: parsed.data.authorId,
      author_type: "institucion",
      volunteer_author_id: null,
      institution_author_id: institution.id,
      rating: parsed.data.rating,
      comment: sanitizedComment,
    });

    if (error) return { error: error.message };

    revalidatePath("/dashboard/reviews");
    return { success: true };
  }

  // Default: volunteer review
  const { data: volunteer } = await supabase
    .from("volunteers")
    .select("id")
    .eq("email", user.email!)
    .single();

  if (!volunteer) {
    return { error: "Debes estar inscrito como voluntario para dejar una resena" };
  }

  const parsed = reviewSchema.safeParse({
    eventId: data.eventId,
    authorId: volunteer.id,
    authorType: "voluntario",
    rating: data.rating,
    comment: data.comment,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues.map((i) => i.message).join(", ") };
  }

  const sanitizedComment = parsed.data.comment
    ? sanitizeHtml(parsed.data.comment)
    : parsed.data.comment;

  const { error } = await supabase.from("reviews").insert({
    event_id: parsed.data.eventId,
    author_id: parsed.data.authorId,
    author_type: parsed.data.authorType,
    volunteer_author_id: parsed.data.authorId,
    institution_author_id: null,
    rating: parsed.data.rating,
    comment: sanitizedComment,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/reviews");
  return { success: true };
}

export async function deleteReview(id: string) {
  const user = await getAuthUser();
  if (!user) return { error: "No autenticado" };

  const profile = await getUserProfile(user.id);
  if (!profile) return { error: "Perfil no encontrado" };

  // System admin can delete any review
  if (profile.role === "admin") {
    const supabase = await createSupabaseServer();
    const { error } = await supabase
      .from("reviews")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);
    if (error) return { error: error.message };
    revalidatePath("/dashboard/reviews");
    return { success: true };
  }

  const supabase = await createSupabaseServer();

  const { data: review } = await supabase
    .from("reviews")
    .select("id, event_id, volunteer_author_id")
    .eq("id", id)
    .single();

  if (!review) return { error: "Resena no encontrada" };

  // Check if user owns the event
  const { data: event } = await supabase
    .from("events")
    .select("created_by")
    .eq("id", review.event_id)
    .single();
  const isEventOwner = event?.created_by === user.id;

  // Check if user is the review author (volunteer email matches)
  let isAuthor = false;
  if (review.volunteer_author_id) {
    const { data: volunteer } = await supabase
      .from("volunteers")
      .select("email")
      .eq("id", review.volunteer_author_id)
      .single();
    isAuthor = volunteer?.email === user.email;
  }

  if (!isEventOwner && !isAuthor) {
    return { error: "No autorizado" };
  }

  // Soft delete
  const { error } = await supabase
    .from("reviews")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/reviews");
  return { success: true };
}
