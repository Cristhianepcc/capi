import { notFound, redirect } from "next/navigation";
import { getEventBySlug } from "@/lib/queries";
import { getAuthUser } from "@/lib/auth";
import { canManageEvent } from "@/lib/authorization";
import EventForm from "@/components/EventForm";

const REVERSE_TYPE_MAP: Record<string, string> = {
  Taller: "Taller",
  Conferencia: "Conferencia",
  Charla: "Charla",
  Programa: "Programa",
  "Evento STEM": "Evento STEM",
  "Voluntariado Educativo": "Voluntariado Educativo",
};

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const user = await getAuthUser();
  if (!user) redirect("/login");

  const allowed = await canManageEvent(user.id, event.id);
  if (!allowed) redirect("/dashboard/events");

  return (
    <EventForm
      mode="edit"
      eventId={event.id}
      defaultValues={{
        title: event.title,
        description: event.description,
        type: REVERSE_TYPE_MAP[event.type] ?? event.type,
        date: event.date,
        location: event.location,
        fullLocation: event.fullLocation,
        studentsGoal: event.studentsGoal,
        institution: event.institution,
        sponsors: event.sponsors,
        about: event.about,
        imageUrl: event.imageUrl,
      }}
      defaultAgenda={event.agenda}
      defaultRoles={event.roles}
    />
  );
}
