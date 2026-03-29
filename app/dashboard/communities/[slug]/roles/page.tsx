import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { getCommunityBySlug, getCommunityRoles, getUserPermissionsInCommunity } from "@/lib/queries";
import RolesClient from "./RolesClient";

export default async function RolesPage({ params }: { params: { slug: string } }) {
  const user = await getAuthUser();
  if (!user) {
    redirect("/login");
  }

  const community = await getCommunityBySlug(params.slug);
  if (!community) {
    return <div>Comunidad no encontrada</div>;
  }

  // Check if user has manage_members permission
  const permissions = await getUserPermissionsInCommunity(user.id, community.id);
  const canManageRoles = permissions.includes("manage_members");

  if (!canManageRoles) {
    return <div>No tienes permisos para gestionar los roles de esta comunidad</div>;
  }

  const roles = await getCommunityRoles(community.id);

  return (
    <RolesClient
      communityId={community.id}
      communityName={community.name}
      initialRoles={roles}
      canManageRoles={canManageRoles}
    />
  );
}
