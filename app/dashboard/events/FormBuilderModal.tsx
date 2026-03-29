"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateEventRegistrationFields } from "@/lib/actions/events";
import { useToast } from "@/lib/useToast";
import FormField from "./FormField";

interface Field {
  id: string;
  fieldKey: string;
  fieldLabel: string;
  fieldType: "text" | "email" | "phone" | "textarea" | "select" | "checkbox";
  required: boolean;
  placeholder: string;
  optionsJson: string[];
}

interface FormBuilderModalProps {
  eventId: string;
  eventSlug: string;
  initialFields: Field[];
  onClose: () => void;
}

export default function FormBuilderModal({ eventId, eventSlug, initialFields, onClose }: FormBuilderModalProps) {
  const router = useRouter();
  const { showToast } = useToast();

  // Agregar campos base por defecto si no existen
  const initializeFields = () => {
    const baseFields = [
      {
        id: "base_name",
        fieldKey: "nombre_completo",
        fieldLabel: "Nombre Completo",
        fieldType: "text" as const,
        required: true,
        placeholder: "Juan Pérez",
        optionsJson: [],
      },
      {
        id: "base_email",
        fieldKey: "email",
        fieldLabel: "Email",
        fieldType: "email" as const,
        required: true,
        placeholder: "tu@email.com",
        optionsJson: [],
      },
      {
        id: "base_role",
        fieldKey: "rol_preferido",
        fieldLabel: "Rol Preferido",
        fieldType: "select" as const,
        required: true,
        placeholder: "Selecciona un rol",
        optionsJson: [],
      },
    ];

    // Si no hay campos, usar los base
    if (initialFields.length === 0) {
      return baseFields;
    }
    return initialFields;
  };

  const [fields, setFields] = useState<Field[]>(initializeFields());
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  function addField() {
    const newField: Field = {
      id: Math.random().toString(36).slice(2),
      fieldKey: "",
      fieldLabel: "",
      fieldType: "text",
      required: false,
      placeholder: "",
      optionsJson: [],
    };
    setFields([...fields, newField]);
    setEditingId(newField.id);
  }

  function updateField(id: string, updates: Partial<Field>) {
    setFields(
      fields.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  }

  function deleteField(id: string) {
    setFields(fields.filter((f) => f.id !== id));
    if (editingId === id) setEditingId(null);
  }

  function moveField(id: string, direction: "up" | "down") {
    const index = fields.findIndex((f) => f.id === id);
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === fields.length - 1)
    ) {
      return;
    }
    const newIndex = direction === "up" ? index - 1 : index + 1;
    const newFields = [...fields];
    [newFields[index], newFields[newIndex]] = [newFields[newIndex], newFields[index]];
    setFields(newFields);
  }

  async function handleSave() {
    // Validar que todos los campos tengan label
    const invalid = fields.find((f) => !f.fieldLabel.trim());
    if (invalid) {
      showToast("Todos los campos deben tener un nombre", "error");
      return;
    }

    setSaving(true);
    try {
      const fieldsToSave = fields.map((f, index) => ({
        fieldKey: f.fieldKey,
        fieldLabel: f.fieldLabel,
        fieldType: f.fieldType,
        required: f.required,
        placeholder: f.placeholder,
        optionsJson: f.optionsJson,
        sortOrder: index,
      }));

      const result = await updateEventRegistrationFields(eventId, fieldsToSave);
      if (result.error) {
        showToast(result.error, "error");
        return;
      }

      showToast("Formulario configurado exitosamente", "success");
      onClose();
      router.refresh();
    } catch (error) {
      showToast("Error al guardar la configuración", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="size-10 rounded-lg bg-[#f49d25]/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#f49d25]">edit_note</span>
              </div>
              <h2 className="text-3xl font-black text-slate-900">Constructor de Formulario</h2>
            </div>
            <p className="text-sm text-slate-500 ml-13">Personaliza los campos de inscripción para los voluntarios</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex gap-8 p-8 bg-slate-50">
          {/* Left: Builder */}
          <div className="flex-1 min-w-0 overflow-y-auto space-y-5 pr-4">
            {/* Header de campos */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Campos de Inscripción</h3>
                <p className="text-sm text-slate-500 mt-1">Edita, agrega o elimina campos según necesites</p>
              </div>
              <button
                onClick={addField}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#f49d25] text-white text-sm font-bold shadow-lg shadow-[#f49d25]/20 hover:brightness-105 transition-all"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Nuevo Campo
              </button>
            </div>

            {/* Campos list */}
            <div className="space-y-3">
              {fields.length === 0 ? (
                <div className="py-12 text-center rounded-xl border-2 border-dashed border-slate-200">
                  <span className="material-symbols-outlined text-5xl text-slate-300 block mb-3">note_add</span>
                  <p className="text-sm text-slate-500 font-medium">No hay campos aún</p>
                  <p className="text-xs text-slate-400 mt-1">Haz click en "Nuevo Campo" para empezar</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className={`rounded-xl border-2 transition-all overflow-hidden ${
                        editingId === field.id
                          ? "border-[#f49d25] bg-white shadow-lg shadow-[#f49d25]/10"
                          : "border-slate-200 bg-white hover:border-[#f49d25]/30 hover:shadow-md"
                      }`}
                    >
                      <button
                        onClick={() => setEditingId(editingId === field.id ? null : field.id)}
                        className="w-full text-left p-4 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 flex-1">
                            <span className="material-symbols-outlined text-[#f49d25] text-xl">{getTypeIcon(field.fieldType)}</span>
                            <div className="flex-1">
                              <p className="font-bold text-slate-900">{field.fieldLabel || "Sin nombre"}</p>
                              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                                <span>{field.fieldType}</span>
                                {field.required && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                                    <span className="material-symbols-outlined text-xs">required</span>
                                    Obligatorio
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                          <span className="material-symbols-outlined text-slate-400 text-xl">
                            {editingId === field.id ? "expand_less" : "expand_more"}
                          </span>
                        </div>
                      </button>

                      {editingId === field.id && (
                        <div className="mt-4 pt-8 px-4 border-t border-slate-200 space-y-4">
                          <FormField field={field} onUpdate={(updates) => updateField(field.id, updates)} />
                          <div className="flex items-center justify-between pt-4">
                            <button
                              onClick={() => deleteField(field.id)}
                              className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg text-sm font-semibold transition-colors"
                            >
                              Eliminar
                            </button>
                            <div className="flex gap-2">
                              <button
                                onClick={() => moveField(field.id, "up")}
                                disabled={index === 0}
                                className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                <span className="material-symbols-outlined text-sm">arrow_upward</span>
                              </button>
                              <button
                                onClick={() => moveField(field.id, "down")}
                                disabled={index === fields.length - 1}
                                className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                <span className="material-symbols-outlined text-sm">arrow_downward</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Preview */}
          <div className="w-96 flex-shrink-0 flex flex-col border-l border-slate-200 pl-6">
            <p className="text-sm font-bold uppercase text-slate-400 tracking-wider mb-4">Vista Previa</p>
            <div className="flex-1 overflow-y-auto pr-4 space-y-4">
              {/* Preview all fields */}
              {fields.map((field) => (
                <div key={field.id}>
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                    {field.fieldLabel || "Campo sin nombre"}
                    {field.required && <span className="text-[#f49d25]">*</span>}
                  </label>

                  {field.fieldType === "text" && (
                    <input disabled type="text" placeholder={field.placeholder} className="w-full mt-1 px-4 py-2.5 rounded-lg border border-slate-200 text-sm bg-slate-50" />
                  )}
                  {field.fieldType === "email" && (
                    <input disabled type="email" placeholder={field.placeholder} className="w-full mt-1 px-4 py-2.5 rounded-lg border border-slate-200 text-sm bg-slate-50" />
                  )}
                  {field.fieldType === "phone" && (
                    <input disabled type="tel" placeholder={field.placeholder} className="w-full mt-1 px-4 py-2.5 rounded-lg border border-slate-200 text-sm bg-slate-50" />
                  )}
                  {field.fieldType === "textarea" && (
                    <textarea disabled placeholder={field.placeholder} rows={3} className="w-full mt-1 px-4 py-2.5 rounded-lg border border-slate-200 text-sm bg-slate-50" />
                  )}
                  {field.fieldType === "select" && (
                    <select disabled className="w-full mt-1 px-4 py-2.5 rounded-lg border border-slate-200 text-sm bg-slate-50">
                      <option>Selecciona...</option>
                      {field.optionsJson.map((opt) => (
                        <option key={opt}>{opt}</option>
                      ))}
                    </select>
                  )}
                  {field.fieldType === "checkbox" && (
                    <label className="flex items-center gap-2 mt-1">
                      <input disabled type="checkbox" className="rounded border-slate-300" />
                      <span className="text-sm text-slate-600">{field.placeholder || field.fieldLabel}</span>
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-6 flex items-center justify-between bg-slate-50">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-semibold hover:bg-slate-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#f49d25] text-white font-semibold shadow-lg shadow-[#f49d25]/20 hover:brightness-105 disabled:opacity-50 transition-all"
          >
            <span className="material-symbols-outlined text-sm">check</span>
            {saving ? "Guardando..." : "Guardar y Publicar"}
          </button>
        </div>
      </div>
    </div>
  );
}

function getTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    text: "text_fields",
    email: "mail",
    phone: "phone",
    textarea: "description",
    select: "list",
    checkbox: "check_box",
  };
  return icons[type] || "help";
}
