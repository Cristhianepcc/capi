import { cookies } from "next/headers";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardSearch from "@/components/DashboardSearch";
import { CommunityProvider } from "@/lib/communityContext";
import { getAuthUser } from "@/lib/auth";
import { getUserProfile, getUserCommunities } from "@/lib/queries";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  const [profile, communities] = await Promise.all([
    getUserProfile(user.id),
    getUserCommunities(user.id),
  ]);

  const isSystemAdmin = profile?.role === "admin";
  const fullName = profile?.fullName ?? null;

  // Read active community from cookie
  const cookieStore = await cookies();
  const activeCommunityId = cookieStore.get("capi-community")?.value ?? null;

  const activeCommunity = activeCommunityId
    ? communities.find((c) => c.id === activeCommunityId) ?? null
    : null;

  return (
    <CommunityProvider
      isSystemAdmin={isSystemAdmin}
      fullName={fullName}
      communities={communities}
      activeCommunity={activeCommunity}
    >
      <div className="flex h-screen overflow-hidden bg-[#f8f7f5]">
        <DashboardSidebar />

        {/* Main */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1 max-w-xl pl-12 lg:pl-0">
              <DashboardSearch />
            </div>
            <div className="flex items-center gap-4">
              <button className="size-10 flex items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:text-[#f49d25] transition-colors relative">
                <span className="material-symbols-outlined">notifications</span>
              </button>
            </div>
          </header>
          <div className="flex-1 overflow-y-auto">{children}</div>
        </div>
      </div>
    </CommunityProvider>
  );
}
