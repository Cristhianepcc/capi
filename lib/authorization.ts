import { createSupabaseServer } from "./supabase/server";
import { getAuthUser } from "./auth";
import { getUserProfile } from "./queries";

export type CommunityPermission =
  | "manage_community"
  | "create_events"
  | "edit_events"
  | "delete_events"
  | "manage_members"
  | "manage_volunteers";

export interface AuthResult {
  user: { id: string; email: string };
  profile: { role: "admin" | "user"; fullName: string | null };
}

export async function requireAuth(): Promise<AuthResult | { error: string }> {
  const user = await getAuthUser();
  if (!user) return { error: "No autenticado" };

  const profile = await getUserProfile(user.id);
  if (!profile) return { error: "Perfil no encontrado" };

  return {
    user: { id: user.id, email: user.email! },
    profile: { role: profile.role as "admin" | "user", fullName: profile.fullName },
  };
}

export async function isSystemAdmin(userId: string): Promise<boolean> {
  const profile = await getUserProfile(userId);
  console.log(`[isSystemAdmin] userId: ${userId}, profile: ${JSON.stringify(profile)}, role === "admin": ${profile?.role === "admin"}`);
  return profile?.role === "admin";
}

export async function canManageEvent(
  userId: string,
  eventId: string
): Promise<boolean> {
  if (await isSystemAdmin(userId)) return true;

  const supabase = await createSupabaseServer();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await supabase
    .from("events")
    .select("created_by, community_id")
    .eq("id", eventId)
    .single() as { data: any };

  if (!data) return false;
  if (data.created_by === userId) return true;

  if (data.community_id) {
    return hasPermission(userId, data.community_id, "edit_events");
  }

  return false;
}

export async function canDeleteEvent(
  userId: string,
  eventId: string
): Promise<boolean> {
  if (await isSystemAdmin(userId)) return true;

  const supabase = await createSupabaseServer();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await supabase
    .from("events")
    .select("created_by, community_id")
    .eq("id", eventId)
    .single() as { data: any };

  if (!data) return false;
  if (data.created_by === userId) return true;

  if (data.community_id) {
    return hasPermission(userId, data.community_id, "delete_events");
  }

  return false;
}

export async function canManageInstitution(
  userId: string,
  institutionId: string
): Promise<boolean> {
  if (await isSystemAdmin(userId)) return true;

  const supabase = await createSupabaseServer();

  const { data: inst } = await supabase
    .from("institutions")
    .select("contact_user_id")
    .eq("id", institutionId)
    .single();
  if (inst?.contact_user_id === userId) return true;

  const { data: ownedEvents } = await supabase
    .from("events")
    .select("id")
    .eq("institution_id", institutionId)
    .eq("created_by", userId)
    .limit(1);
  return !!(ownedEvents && ownedEvents.length > 0);
}

export async function canManageEventVolunteer(
  userId: string,
  eventVolunteerId: string
): Promise<boolean> {
  if (await isSystemAdmin(userId)) return true;

  const supabase = await createSupabaseServer();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: ev } = await supabase
    .from("event_volunteers")
    .select("event_id, events!inner(created_by)")
    .eq("id", eventVolunteerId)
    .single() as { data: any };

  if (!ev) return false;
  const event = ev.events;
  if (event.created_by === userId) return true;

  // Check community role via event's community_id
  const { data: eventData } = await supabase
    .from("events")
    .select("community_id")
    .eq("id", ev.event_id)
    .single() as { data: any };

  if (eventData?.community_id) {
    return hasPermission(userId, eventData.community_id, "manage_volunteers");
  }

  return false;
}

export async function canManageCommunity(
  userId: string,
  communityId: string
): Promise<boolean> {
  return hasPermission(userId, communityId, "manage_community");
}

export async function canCreateEventInCommunity(
  userId: string,
  communityId: string
): Promise<boolean> {
  return hasPermission(userId, communityId, "create_events");
}

export async function hasPermission(
  userId: string,
  communityId: string,
  permission: CommunityPermission
): Promise<boolean> {
  if (await isSystemAdmin(userId)) return true;

  const supabase = await createSupabaseServer();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await supabase
    .rpc("has_permission", {
      check_user_id: userId,
      check_community_id: communityId,
      permission,
    }) as { data: any };

  return !!data;
}

/** @deprecated Use hasPermission() instead. Kept for backward compatibility during migration. */
export async function hasCommunityRole(
  userId: string,
  communityId: string,
  allowedRoles: ("lider" | "admin" | "miembro")[]
): Promise<boolean> {
  const supabase = await createSupabaseServer();
  const { data } = await supabase
    .from("community_members")
    .select("id")
    .eq("user_id", userId)
    .eq("community_id", communityId)
    .in("role", allowedRoles)
    .limit(1)
    .maybeSingle();

  return !!data;
}
