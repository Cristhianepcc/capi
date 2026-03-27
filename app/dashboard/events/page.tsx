import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getEvents, getEventRegistrationFields } from "@/lib/queries";
import { getAuthUser } from "@/lib/auth";
import EventsClient from "./EventsClient";

export default async function DashboardEventsPage() {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  const cookieStore = await cookies();
  const activeCommunityId = cookieStore.get("capi-community")?.value ?? null;

  const events = await getEvents(true, activeCommunityId ?? undefined);

  // Load registration fields for each event
  const eventsWithFields = await Promise.all(
    events.map(async (event) => {
      const fields = await getEventRegistrationFields(event.dbId);
      return {
        ...event,
        registrationFields: fields.map((f) => ({
          id: f.id,
          fieldKey: f.fieldKey,
          fieldLabel: f.fieldLabel,
          fieldType: f.fieldType as "text" | "email" | "phone" | "textarea" | "select" | "checkbox",
          required: f.required,
          placeholder: f.placeholder || "",
          optionsJson: f.optionsJson,
        })),
      };
    })
  );

  return <EventsClient initialEvents={eventsWithFields as any} />;
}
