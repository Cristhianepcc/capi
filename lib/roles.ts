export interface EventRole {
  name: string;
  slots: number;
}

export const DEFAULT_EVENT_ROLES: EventRole[] = [
  { name: "Instructor", slots: 5 },
  { name: "Facilitador", slots: 3 },
  { name: "Mentor", slots: 3 },
  { name: "Asistente", slots: 5 },
  { name: "Coordinador", slots: 2 },
  { name: "Moderador", slots: 2 },
];
