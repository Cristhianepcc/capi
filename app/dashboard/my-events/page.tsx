import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { getMyEvents } from "@/lib/queries";
import MyEventsClient from "./MyEventsClient";

export default async function MyEventsPage() {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  const events = await getMyEvents(user.id);
  return <MyEventsClient events={events} />;
}
