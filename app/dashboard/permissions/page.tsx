import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { getUserProfile, getAllUserProfiles, getAllCommunitiesForAdmin, getCommunityMembers, getCommunityRoles } from "@/lib/queries";
import PermissionsClient from "./PermissionsClient";

export default async function PermissionsPage() {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  const profile = await getUserProfile(user.id);
  if (!profile || profile.role !== "admin") redirect("/dashboard");

  const [users, communities] = await Promise.all([
    getAllUserProfiles(),
    getAllCommunitiesForAdmin(),
  ]);

  // Load members and roles for each community in parallel
  const communitiesWithData = await Promise.all(
    communities.map(async (c) => {
      const [members, roles] = await Promise.all([
        getCommunityMembers(c.id),
        getCommunityRoles(c.id),
      ]);
      return {
        ...c,
        members,
        roles: roles.map((r) => ({ id: r.id, name: r.name, isOwner: r.is_owner })),
      };
    })
  );

  return (
    <PermissionsClient
      users={users}
      communities={communitiesWithData}
      currentUserId={user.id}
    />
  );
}
