import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { getUserProfile, getMyStats } from "@/lib/queries";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  const profile = await getUserProfile(user.id);
  if (!profile) redirect("/dashboard");

  const stats = await getMyStats(user.id);

  return (
    <ProfileClient
      fullName={profile.fullName ?? ""}
      email={user.email ?? ""}
      stats={stats}
    />
  );
}
