import { z } from "zod";

export const eventRoleSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  slots: z.number().min(1, "Al menos 1"),
});

export const eventSchema = z.object({
  title: z.string().min(5, "Mínimo 5 caracteres"),
  description: z.string().min(20, "Mínimo 20 caracteres"),
  type: z.string().min(1, "Selecciona un tipo"),
  date: z.string().min(1, "Selecciona una fecha"),
  location: z.string().min(3, "Mínimo 3 caracteres"),
  fullLocation: z.string().min(5, "Ingresa la dirección completa"),
  studentsGoal: z.number().min(1, "Al menos 1 estudiante"),
  institution: z.string().min(2, "Ingresa la institución"),
  sponsors: z.string(),
  about: z.string().min(30, "Mínimo 30 caracteres"),
  imageUrl: z.string().url().optional().or(z.literal("")),
  roles: z.array(eventRoleSchema).min(1, "Agrega al menos un rol"),
});

export type EventFormData = z.infer<typeof eventSchema>;

export const agendaItemSchema = z.object({
  time: z.string().min(1, "Hora requerida"),
  title: z.string().min(2, "Mínimo 2 caracteres"),
  description: z.string().optional(),
});

export const volunteerStatusSchema = z.object({
  eventVolunteerId: z.string().uuid(),
  status: z.enum(["pendiente", "aprobado", "rechazado"]),
});

export const volunteerRoleSchema = z.object({
  eventVolunteerId: z.string().uuid(),
  role: z.string().min(1),
});

export const volunteerHoursSchema = z.object({
  eventVolunteerId: z.string().uuid(),
  hours: z.number().min(0),
});

export const institutionStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["activo", "inactivo", "solicitud"]),
});

export const reviewSchema = z.object({
  eventId: z.string().uuid(),
  authorId: z.string().uuid(),
  authorType: z.enum(["voluntario", "institucion"]),
  rating: z.number().min(1).max(5),
  comment: z.string().max(1000, "Máximo 1000 caracteres").optional(),
});

export const institutionSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  type: z.enum(["colegio", "universidad", "centro_comunitario", "ong", "centro_educativo"]),
  city: z.string().min(2, "Mínimo 2 caracteres"),
  contact: z.string().min(2, "Mínimo 2 caracteres"),
  email: z.string().email("Email inválido"),
});

export const volunteerSignupSchema = z.object({
  eventId: z.string().uuid(),
  name: z.string().min(2, "Mínimo 2 caracteres"),
  email: z.string().email("Email inválido"),
  role: z.string().min(1, "Selecciona un rol"),
});

// Registration fields
export const REGISTRATION_FIELD_TYPES = ["text", "email", "phone", "textarea", "select", "checkbox"] as const;
export type RegistrationFieldType = typeof REGISTRATION_FIELD_TYPES[number];

export const registrationFieldSchema = z.object({
  fieldKey: z.string().min(1).max(100),
  fieldLabel: z.string().min(2, "Mínimo 2 caracteres").max(200),
  fieldType: z.enum(REGISTRATION_FIELD_TYPES),
  required: z.boolean().default(false),
  placeholder: z.string().max(300).optional(),
  optionsJson: z.array(z.string().min(1)).optional(),
  sortOrder: z.number().int().min(0),
});

export type RegistrationField = z.infer<typeof registrationFieldSchema>;
