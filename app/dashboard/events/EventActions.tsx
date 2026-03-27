"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { deleteEvent } from "@/lib/actions/events";
import { useToast } from "@/lib/useToast";
import FormBuilderModal from "./FormBuilderModal";

interface Field {
  id: string;
  fieldKey: string;
  fieldLabel: string;
  fieldType: "text" | "email" | "phone" | "textarea" | "select" | "checkbox";
  required: boolean;
  placeholder: string;
  optionsJson: string[];
}

export default function EventActions({
  eventId,
  eventSlug,
  initialFields,
}: {
  eventId: string;
  eventSlug: string;
  initialFields: Field[];
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const [showFormBuilder, setShowFormBuilder] = useState(false);

  async function handleDelete() {
    if (!confirm("¿Estás seguro de eliminar este evento? Esta acción no se puede deshacer.")) return;

    const result = await deleteEvent(eventId);
    if (result.error) {
      showToast(result.error, "error");
    } else {
      showToast("Evento eliminado exitosamente", "success");
      router.refresh();
    }
  }

  return (
    <>
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={() => setShowFormBuilder(true)}
          className="px-3 py-1.5 rounded-lg bg-[#f49d25]/10 text-[#f49d25] text-sm font-semibold hover:bg-[#f49d25]/20 transition-colors flex items-center gap-1"
          title="Buscar voluntarios"
          aria-label="Configurar formulario de inscripción"
        >
          <span className="material-symbols-outlined text-sm">group_add</span>
          Buscar Voluntarios
        </button>
        <Link
          href={`/events/${eventSlug}`}
          className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-[#f49d25]/10 hover:text-[#f49d25] transition-colors"
          title="Ver pública"
          aria-label="Ver página pública del evento"
        >
          <span className="material-symbols-outlined text-sm">open_in_new</span>
        </Link>
        <Link
          href={`/dashboard/events/${eventSlug}/edit`}
          className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-[#f49d25]/10 hover:text-[#f49d25] transition-colors"
          title="Editar"
          aria-label="Editar evento"
        >
          <span className="material-symbols-outlined text-sm">edit</span>
        </Link>
        <button
          onClick={handleDelete}
          className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          title="Eliminar"
          aria-label="Eliminar evento"
        >
          <span className="material-symbols-outlined text-sm">delete</span>
        </button>
      </div>

      {showFormBuilder && (
        <FormBuilderModal
          eventId={eventId}
          eventSlug={eventSlug}
          initialFields={initialFields}
          onClose={() => setShowFormBuilder(false)}
        />
      )}
    </>
  );
}
