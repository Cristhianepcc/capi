import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { getCommunityBySlug, getCommunityMembers, getCommunityRoles, getUserPermissionsInCommunity } from "@/lib/queries";
import MembersClient from "./MembersClient";

export default async function MembersPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await getAuthUser();
  if (!user) redirect("/login");

  const community = await getCommunityBySlug(slug);
  if (!community) notFound();

  const [members, roles, userPermissions] = await Promise.all([
    getCommunityMembers(community.id),
    getCommunityRoles(community.id),
    getUserPermissionsInCommunity(user.id, community.id),
  ]);

  const canManageMembers = userPermissions.includes("manage_members");

  // Format roles for the client
  const availableRoles = roles.map((r) => ({
    id: r.id,
    name: r.name,
    isOwner: r.is_owner,
  }));

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href={`/dashboard/communities/${slug}`}
            className="size-10 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-[#f49d25] transition-colors"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
          </Link>
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Miembros</h2>
            <p className="text-slate-500 mt-0.5">{community.name}</p>
          </div>
        </div>
        {canManageMembers && (
          <Link
            href={`/dashboard/communities/${slug}/roles`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
          >
            Gestionar Roles
          </Link>
        )}
      </div>

      <MembersClient
        communityId={community.id}
        initialMembers={members}
        availableRoles={availableRoles}
        canManageMembers={canManageMembers}
      />
    </div>
  );
}
