import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { getUserProfile, getAllUserProfiles } from "@/lib/queries";
import UsersClient from "./UsersClient";

export default async function UsersPage() {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  const profile = await getUserProfile(user.id);
  if (!profile || profile.role !== "admin") redirect("/dashboard");

  const users = await getAllUserProfiles();
  return <UsersClient users={users} currentUserId={user.id} />;
}
