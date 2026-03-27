import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getVolunteersWithEvents } from "@/lib/queries";
import { getAuthUser } from "@/lib/auth";
import VolunteersClient from "./VolunteersClient";

export default async function VolunteersPage() {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  const cookieStore = await cookies();
  const activeCommunityId = cookieStore.get("capi-community")?.value ?? undefined;

  const volunteers = await getVolunteersWithEvents(activeCommunityId);
  return <VolunteersClient initialVolunteers={volunteers} />;
}
