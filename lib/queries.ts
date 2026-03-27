import { createSupabaseServer } from "./supabase/server";

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, "0");
  const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  return `${day} ${months[date.getMonth()]}`;
}

const TYPE_LABELS: Record<string, string> = {
  taller: "Taller",
  conferencia: "Conferencia",
  charla: "Charla",
  programa: "Programa",
  evento_stem: "Evento STEM",
  voluntariado_educativo: "Voluntariado Educativo",
};

const INSTITUTION_TYPE_LABELS: Record<string, string> = {
  colegio: "Colegio",
  universidad: "Universidad",
  centro_comunitario: "Centro Comunitario",
  ong: "ONG",
  centro_educativo: "Centro Educativo",
};

export async function getEvents(includeAll = false, communityId?: string) {
  const supabase = await createSupabaseServer();

  // Try with communities join first; fall back without if table doesn't exist
  const selectFields = `
    *,
    institutions ( name ),
    agenda_items ( time, title, description, sort_order ),
    event_sponsors ( sponsors ( name ) ),
    event_volunteers ( status ),
    event_roles ( name, slots, sort_order )
  `;

  let query = supabase
    .from("events")
    .select(selectFields)
    .is("deleted_at", null)
    .order("date", { ascending: true });

  if (!includeAll) {
    query = query.in("status", ["activo", "finalizado"]);
  }

  if (communityId) {
    query = query.eq("community_id", communityId);
  }

  const { data, error } = await query;

  if (error) throw error;

  // Fetch community names separately (resilient if table doesn't exist)
  const communityIds = [...new Set((data ?? []).map((e: any) => e.community_id).filter(Boolean))];
  let communityMap: Record<string, { name: string; slug: string }> = {};
  if (communityIds.length > 0) {
    const { data: communities } = await supabase
      .from("communities")
      .select("id, name, slug")
      .in("id", communityIds);
    if (communities) {
      communityMap = Object.fromEntries(communities.map((c: any) => [c.id, { name: c.name, slug: c.slug }]));
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((e: any) => {
    const community = e.community_id ? communityMap[e.community_id] : null;
    return {
      id: e.slug,
      dbId: e.id,
      title: e.title,
      description: e.description,
      date: formatDate(e.date),
      location: e.location,
      type: TYPE_LABELS[e.type] ?? e.type,
      spotsLeft: e.volunteers_needed - (e.event_volunteers ?? []).filter((ev: any) => ev.status === "aprobado").length,
      status: e.status,
      image: e.image_url ?? "",
      institution: e.institutions?.name ?? "",
      communityName: community?.name ?? null,
      communitySlug: community?.slug ?? null,
      sponsors: (e.event_sponsors ?? []).map((es: any) => es.sponsors?.name ?? ""),
      volunteersNeeded: e.volunteers_needed,
      volunteersJoined: (e.event_volunteers ?? []).filter((ev: any) => ev.status === "aprobado").length,
      studentsGoal: e.students_goal,
      agenda: (e.agenda_items ?? [])
        .sort((a: any, b: any) => a.sort_order - b.sort_order)
        .map((a: any) => ({ time: a.time, title: a.title, description: a.description ?? "" })),
      about: e.about ?? "",
      fullLocation: e.full_location ?? "",
      roles: ((e.event_roles ?? []) as any[])
        .sort((a: any, b: any) => a.sort_order - b.sort_order)
        .map((r: any) => ({ name: r.name as string, slots: r.slots as number })),
    };
  });
}

export async function getVolunteersWithEvents(communityId?: string) {
  const supabase = await createSupabaseServer();
  let query = supabase
    .from("event_volunteers")
    .select(`
      id,
      role,
      status,
      hours,
      joined_at,
      volunteers ( id, name, email, avatar_color, avatar_hex ),
      events!inner ( title, deleted_at, created_by, event_roles ( name, sort_order ) )
    `)
    .is("events.deleted_at", null)
    .order("joined_at", { ascending: false });

  // If communityId filter is requested, we need to filter by community_id on events
  // This requires the community_id column to exist
  if (communityId) {
    // Get event IDs for this community first
    const { data: communityEvents } = await supabase
      .from("events")
      .select("id")
      .eq("community_id", communityId);
    if (communityEvents && communityEvents.length > 0) {
      query = query.in("event_id", communityEvents.map((e) => e.id));
    } else {
      return [];
    }
  }

  const { data, error } = await query;

  if (error) throw error;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((ev: any) => {
    const name: string = ev.volunteers?.name ?? "";
    const initials = name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    const eventRoles = ((ev.events?.event_roles ?? []) as any[])
      .sort((a: any, b: any) => a.sort_order - b.sort_order)
      .map((r: any) => r.name as string);
    return {
      id: ev.id,
      name,
      email: ev.volunteers?.email ?? "",
      event: ev.events?.title ?? "",
      role: ev.role,
      status: ev.status,
      hours: ev.hours,
      joinedAt: new Date(ev.joined_at).toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      initials,
      color: ev.volunteers?.avatar_color ?? "bg-slate-400",
      avatarHex: ev.volunteers?.avatar_hex ?? null,
      eventRoles,
    };
  });
}

export async function getInstitutions(communityId?: string) {
  const supabase = await createSupabaseServer();

  // If community filter, get institution IDs used by that community's events
  let institutionIds: string[] | null = null;
  if (communityId) {
    const { data: communityEvents } = await supabase
      .from("events")
      .select("institution_id")
      .eq("community_id", communityId)
      .is("deleted_at", null);
    institutionIds = [...new Set((communityEvents ?? []).map((e) => e.institution_id))];
    if (institutionIds.length === 0) return [];
  }

  let query = supabase
    .from("institutions")
    .select(`
      *,
      events (id, students_goal)
    `)
    .is("deleted_at", null)
    .order("name");

  if (institutionIds) {
    query = query.in("id", institutionIds);
  }

  const { data, error } = await query;

  if (error) throw error;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((i: any) => ({
    id: i.id,
    name: i.name,
    type: INSTITUTION_TYPE_LABELS[i.type] ?? i.type,
    city: i.city,
    contact: i.contact,
    email: i.email,
    status: i.status,
    eventsHosted: (i.events ?? []).length,
    studentsImpacted: (i.events ?? []).reduce((s: number, e: any) => s + (e.students_goal ?? 0), 0),
    since:
      i.status === "solicitud"
        ? "—"
        : new Date(i.created_at).toLocaleDateString("es-PE", { month: "short", year: "numeric" }),
  }));
}

export async function getReviews(communityId?: string) {
  const supabase = await createSupabaseServer();

  // If community filter, get event IDs for that community
  let eventIds: string[] | null = null;
  if (communityId) {
    const { data: communityEvents } = await supabase
      .from("events")
      .select("id")
      .eq("community_id", communityId)
      .is("deleted_at", null);
    eventIds = (communityEvents ?? []).map((e) => e.id);
    if (eventIds.length === 0) return [];
  }

  let query = supabase
    .from("reviews")
    .select(`
      id,
      event_id,
      author_type,
      rating,
      comment,
      created_at,
      events (slug),
      volunteer_author:volunteers!reviews_volunteer_author_id_fkey (name),
      institution_author:institutions!reviews_institution_author_id_fkey (name)
    `)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (eventIds) {
    query = query.in("event_id", eventIds);
  }

  const { data, error } = await query;

  if (error) throw error;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((r: any) => ({
    id: r.id,
    eventId: r.events?.slug ?? r.event_id,
    author:
      r.author_type === "voluntario"
        ? (r.volunteer_author?.name ?? "Voluntario")
        : (r.institution_author?.name ?? "Institución"),
    role: r.author_type === "voluntario" ? "Voluntario" : "Institución",
    rating: r.rating,
    comment: r.comment ?? "",
    date: new Date(r.created_at).toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
  }));
}

export async function getEventBySlug(slug: string) {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase
    .from("events")
    .select(`
      *,
      institutions ( name ),
      event_sponsors ( sponsors ( name ) ),
      agenda_items ( time, title, description, sort_order ),
      event_roles ( name, slots, sort_order )
    `)
    .eq("slug", slug)
    .single();

  if (error || !data) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const e = data as any;

  // Fetch community name separately (resilient)
  let communityName: string | null = null;
  let communitySlug: string | null = null;
  if (e.community_id) {
    const { data: community } = await supabase
      .from("communities")
      .select("name, slug")
      .eq("id", e.community_id)
      .maybeSingle();
    if (community) {
      communityName = community.name;
      communitySlug = community.slug;
    }
  }

  return {
    id: e.id,
    slug: e.slug,
    title: e.title,
    description: e.description,
    type: TYPE_LABELS[e.type] ?? e.type,
    rawType: e.type,
    date: e.date,
    location: e.location,
    fullLocation: e.full_location ?? "",
    volunteersNeeded: e.volunteers_needed,
    studentsGoal: e.students_goal,
    institution: e.institutions?.name ?? "",
    communityName,
    communitySlug,
    sponsors: (e.event_sponsors ?? []).map((es: any) => es.sponsors?.name ?? "").filter(Boolean).join(", "),
    about: e.about ?? "",
    status: e.status,
    imageUrl: e.image_url ?? "",
    agenda: (e.agenda_items ?? [])
      .sort((a: any, b: any) => a.sort_order - b.sort_order)
      .map((a: any) => ({ time: a.time, title: a.title, description: a.description ?? "" })),
    roles: ((e.event_roles ?? []) as any[])
      .sort((a: any, b: any) => a.sort_order - b.sort_order)
      .map((r: any) => ({ name: r.name as string, slots: r.slots as number })),
  };
}

export async function getUserProfile(userId: string) {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase
    .from("user_profiles")
    .select("role, full_name")
    .eq("id", userId)
    .single();

  if (error || !data) return null;
  return { role: data.role, fullName: data.full_name };
}

export async function getPendingApplications(communityId?: string) {
  const supabase = await createSupabaseServer();
  let query = supabase
    .from("event_volunteers")
    .select(`
      id,
      volunteers ( name, email, avatar_color, avatar_hex ),
      events!inner ( title, created_by )
    `)
    .eq("status", "pendiente")
    .order("joined_at", { ascending: false })
    .limit(5);

  if (communityId) {
    const { data: communityEvents } = await supabase
      .from("events")
      .select("id")
      .eq("community_id", communityId);
    if (communityEvents && communityEvents.length > 0) {
      query = query.in("event_id", communityEvents.map((e) => e.id));
    } else {
      return [];
    }
  }

  const { data, error } = await query;

  if (error) throw error;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((ev: any) => {
    const name: string = ev.volunteers?.name ?? "";
    const initials = name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    return {
      id: ev.id,
      name,
      email: ev.volunteers?.email ?? "",
      event: ev.events?.title ?? "",
      initials,
      color: ev.volunteers?.avatar_color ?? "bg-amber-400",
      avatarHex: ev.volunteers?.avatar_hex ?? null,
    };
  });
}

// --- Volunteer self-service queries ---

export async function getMyEvents(userId: string) {
  const supabase = await createSupabaseServer();

  const { data: volunteer } = await supabase
    .from("volunteers")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (!volunteer) return [];

  const { data, error } = await supabase
    .from("event_volunteers")
    .select(`
      id,
      role,
      status,
      hours,
      events!inner ( slug, title, date, location, deleted_at )
    `)
    .eq("volunteer_id", volunteer.id)
    .is("events.deleted_at", null)
    .order("joined_at", { ascending: false });

  if (error) throw error;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((ev: any) => ({
    eventVolunteerId: ev.id,
    eventSlug: ev.events.slug,
    eventTitle: ev.events.title,
    eventDate: ev.events.date,
    eventLocation: ev.events.location,
    role: ev.role,
    status: ev.status as "pendiente" | "aprobado" | "rechazado",
    hours: ev.hours,
  }));
}

export async function getMyStats(userId: string) {
  const supabase = await createSupabaseServer();

  const { data: volunteer } = await supabase
    .from("volunteers")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (!volunteer) {
    return { totalEvents: 0, totalHours: 0, pendingCount: 0, approvedCount: 0, rejectedCount: 0 };
  }

  const { data, error } = await supabase
    .from("event_volunteers")
    .select("status, hours")
    .eq("volunteer_id", volunteer.id);

  if (error) throw error;

  const rows = data ?? [];
  return {
    totalEvents: rows.length,
    totalHours: rows.reduce((s, r) => s + (r.hours ?? 0), 0),
    pendingCount: rows.filter((r) => r.status === "pendiente").length,
    approvedCount: rows.filter((r) => r.status === "aprobado").length,
    rejectedCount: rows.filter((r) => r.status === "rechazado").length,
  };
}

// --- Admin queries ---

export async function getAllUserProfiles() {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase
    .from("user_profiles")
    .select("id, role, full_name, created_at")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

// --- Stats ---

export async function getStats(communityId?: string) {
  const supabase = await createSupabaseServer();

  if (communityId) {
    const { data: communityEvents } = await supabase
      .from("events")
      .select("id, students_goal, event_volunteers(status)")
      .eq("community_id", communityId)
      .in("status", ["activo", "finalizado"]);

    const events = communityEvents ?? [];
    const eventsHosted = events.length;
    const volunteerIds = new Set<string>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let approvedCount = 0;
    events.forEach((e: any) => {
      (e.event_volunteers ?? []).forEach((ev: any) => {
        if (ev.status === "aprobado") {
          approvedCount++;
        }
      });
    });
    const studentsReached = events.reduce((s, e) => s + (e.students_goal ?? 0), 0);

    const { data: communityInst } = await supabase
      .from("events")
      .select("institution_id")
      .eq("community_id", communityId);
    const uniqueInst = new Set((communityInst ?? []).map((e) => e.institution_id));

    const { data: communityVolunteers } = await supabase
      .from("event_volunteers")
      .select("volunteer_id, event_id, status")
      .in("event_id", events.map((e) => e.id))
      .eq("status", "aprobado");
    (communityVolunteers ?? []).forEach((v) => volunteerIds.add(v.volunteer_id));

    return {
      totalVolunteers: volunteerIds.size.toLocaleString() + "+",
      eventsHosted,
      studentsReached:
        studentsReached > 1000 ? (studentsReached / 1000).toFixed(1) + "k" : String(studentsReached),
      institutionsBenefited: uniqueInst.size,
      volunteerHours: approvedCount.toLocaleString(),
    };
  }

  // Global stats (system admin or no community selected)
  const [volunteersRes, eventsRes, institutionsRes, hoursRes, eventsResult] = await Promise.all([
    supabase.from("volunteers").select("id", { count: "exact", head: true }),
    supabase.from("events").select("id", { count: "exact", head: true }).in("status", ["activo", "finalizado"]),
    supabase.from("institutions").select("id", { count: "exact", head: true }).eq("status", "activo"),
    supabase.from("event_volunteers").select("id", { count: "exact", head: true }).eq("status", "aprobado"),
    supabase.from("events").select("students_goal").in("status", ["activo", "finalizado"]),
  ]);

  type EventsRow = { students_goal: number }[];
  const eventsList = (eventsResult.data as EventsRow) ?? [];

  const totalVolunteers = volunteersRes.count ?? 0;
  const eventsHosted = eventsRes.count ?? 0;
  const institutionsBenefited = institutionsRes.count ?? 0;
  const volunteerHours = hoursRes.count ?? 0;
  const studentsReached = eventsList.reduce((s, e) => s + (e.students_goal ?? 0), 0);

  return {
    totalVolunteers: totalVolunteers.toLocaleString() + "+",
    eventsHosted,
    studentsReached:
      studentsReached > 1000 ? (studentsReached / 1000).toFixed(1) + "k" : String(studentsReached),
    institutionsBenefited,
    volunteerHours: volunteerHours.toLocaleString(),
  };
}

// --- Community queries ---

export async function getUserCommunities(userId: string) {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase
    .from("community_members")
    .select(`
      community_roles!inner ( name ),
      communities!inner ( id, name, slug, status )
    `)
    .eq("user_id", userId)
    .eq("communities.status", "activo");

  // Return empty array if table doesn't exist yet (migrations not applied)
  if (error) return [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((m: any) => ({
    id: m.communities.id as string,
    name: m.communities.name as string,
    slug: m.communities.slug as string,
    role: m.community_roles?.name as string,
  }));
}

export async function getCommunityMembers(communityId: string) {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase
    .from("community_members")
    .select(`
      id,
      user_id,
      community_role_id,
      joined_at,
      invited_by,
      user_profiles!inner ( full_name ),
      community_roles!inner ( name, is_owner )
    `)
    .eq("community_id", communityId)
    .order("joined_at", { ascending: true });

  if (error) return [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((m: any) => ({
    id: m.id,
    userId: m.user_id,
    communityRoleId: m.community_role_id,
    roleName: m.community_roles?.name ?? "Sin rol",
    isOwner: m.community_roles?.is_owner ?? false,
    fullName: m.user_profiles?.full_name ?? "Sin nombre",
    joinedAt: new Date(m.joined_at).toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
  }));
}

export async function getCommunityRoles(communityId: string) {
  const supabase = await createSupabaseServer();
  const { data: roles, error: rolesError } = await supabase
    .from("community_roles")
    .select("id, name, description, is_owner")
    .eq("community_id", communityId)
    .order("is_owner", { ascending: false })
    .order("created_at", { ascending: true });

  if (rolesError) return [];

  // For each role, fetch its permissions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rolesWithPermissions = await Promise.all((roles ?? []).map(async (role: any) => {
    const { data: permissions } = await supabase
      .from("community_role_permissions")
      .select("permission_key")
      .eq("role_id", role.id);

    return {
      id: role.id,
      name: role.name,
      description: role.description,
      isOwner: role.is_owner,
      permissions: (permissions ?? []).map((p: any) => p.permission_key),
    };
  }));

  return rolesWithPermissions;
}

export async function getUserPermissionsInCommunity(userId: string, communityId: string) {
  const supabase = await createSupabaseServer();
  const { data } = await supabase
    .rpc("get_user_permissions", {
      check_user_id: userId,
      check_community_id: communityId,
    });

  return (data ?? []) as string[];
}

export async function getCommunityBySlug(slug: string) {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase
    .from("communities")
    .select("id, name, slug, description, logo_url, website, instagram, twitter, linkedin, github, discord, status, created_by, created_at, updated_at")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return data;
}

export async function getCommunityEvents(communityId: string) {
  return getEvents(true, communityId);
}

export async function getPublicCommunities() {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase
    .from("communities")
    .select("id, name, slug, description, logo_url")
    .eq("status", "activo")
    .is("deleted_at", null)
    .order("created_at", { ascending: true });

  if (error) return [];

  // For each community, count members and events
  const communities = data ?? [];
  const result = [];

  for (const c of communities) {
    const [membersRes, eventsRes] = await Promise.all([
      supabase
        .from("community_members")
        .select("id", { count: "exact", head: true })
        .eq("community_id", c.id),
      supabase
        .from("events")
        .select("id", { count: "exact", head: true })
        .eq("community_id", c.id)
        .is("deleted_at", null)
        .in("status", ["activo", "finalizado"]),
    ]);

    result.push({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      logoUrl: c.logo_url,
      membersCount: membersRes.count ?? 0,
      eventsCount: eventsRes.count ?? 0,
    });
  }

  return result;
}

export async function getPendingCommunityRequests() {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase
    .from("communities")
    .select("id, name, slug, description, created_by, created_at")
    .eq("status", "solicitud")
    .is("deleted_at", null)
    .order("created_at", { ascending: true });

  console.log(`[getPendingCommunityRequests] error: ${error?.message}, data count: ${data?.length ?? 0}`);
  if (error) {
    console.log(`[getPendingCommunityRequests] Full error:`, error);
    return [];
  }

  // Get creator names from user_profiles
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const communities = (data ?? []) as any[];

  if (communities.length === 0) return [];

  const creatorIds = [...new Set(communities.map(c => c.created_by))];
  const { data: profiles } = await supabase
    .from("user_profiles")
    .select("id, full_name")
    .in("id", creatorIds);

  const profileMap = new Map((profiles ?? []).map(p => [p.id, p.full_name]));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return communities.map((c: any) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    createdBy: c.created_by,
    creatorName: profileMap.get(c.created_by) ?? "Sin nombre",
    createdAt: new Date(c.created_at).toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
  }));
}

export async function getMyCommunityRequests(userId: string) {
  const supabase = await createSupabaseServer();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await supabase
    .from("communities")
    .select("id, name, slug, status, rejection_reason, created_at")
    .eq("created_by", userId)
    .in("status", ["solicitud", "rechazado"] as any)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  console.log(`[getMyCommunityRequests] userId: ${userId}, error: ${error?.message}, data count: ${data?.length ?? 0}`);
  if (error) {
    console.log(`[getMyCommunityRequests] Full error:`, error);
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((c: any) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    status: (c.status as string) as "solicitud" | "rechazado",
    rejectionReason: c.rejection_reason,
    createdAt: new Date(c.created_at).toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
  }));
}

// --- Institution representative queries ---

export async function getLinkedInstitution(userId: string) {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase
    .from("institutions")
    .select(`
      *,
      events (id, title, slug, date, status, students_goal)
    `)
    .eq("contact_user_id", userId)
    .is("deleted_at", null)
    .maybeSingle();

  if (error || !data) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const i = data as any;
  const events = (i.events ?? []) as any[];
  return {
    id: i.id,
    name: i.name,
    type: INSTITUTION_TYPE_LABELS[i.type] ?? i.type,
    rawType: i.type,
    city: i.city,
    contact: i.contact,
    email: i.email,
    status: i.status,
    eventsHosted: events.length,
    studentsImpacted: events.reduce((s: number, e: any) => s + (e.students_goal ?? 0), 0),
    events: events.map((e: any) => ({
      id: e.id,
      title: e.title,
      slug: e.slug,
      date: formatDate(e.date),
      rawDate: e.date,
      status: e.status,
      studentsGoal: e.students_goal,
    })),
  };
}

export async function getEventRegistrationFields(eventId: string) {
  const supabase = await createSupabaseServer();

  const { data } = await supabase
    .from("event_registration_fields")
    .select("id, field_key, field_label, field_type, required, placeholder, options_json, sort_order")
    .eq("event_id", eventId)
    .order("sort_order", { ascending: true });

  return (data ?? []).map((f: any) => ({
    id: f.id as string,
    fieldKey: f.field_key as string,
    fieldLabel: f.field_label as string,
    fieldType: f.field_type as string,
    required: f.required as boolean,
    placeholder: f.placeholder as string | null,
    optionsJson: (f.options_json ?? []) as string[],
    sortOrder: f.sort_order as number,
  }));
}

export async function getAllCommunitiesForAdmin() {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase
    .from("communities")
    .select("id, name, slug")
    .eq("status", "activo")
    .is("deleted_at", null)
    .order("name", { ascending: true });

  if (error) return [];
  return (data ?? []) as { id: string; name: string; slug: string }[];
}
