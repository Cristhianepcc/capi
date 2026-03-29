"use client";

interface Field {
  id: string;
  fieldKey: string;
  fieldLabel: string;
  fieldType: "text" | "email" | "phone" | "textarea" | "select" | "checkbox";
  required: boolean;
  placeholder: string;
  optionsJson: string[];
}

interface FormFieldProps {
  field: Field;
  onUpdate: (updates: Partial<Field>) => void;
}

function labelToKey(label: string): string {
  return label
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/(^_|_$)/g, "")
    .slice(0, 100);
}

export default function FormField({ field, onUpdate }: FormFieldProps) {
  const inputClasses = "w-full px-4 py-3 rounded-lg border border-slate-200 text-xs box-border focus:outline-none focus:ring-1 focus:ring-[#f49d25]/50 focus:border-[#f49d25]";

  return (
    <div className="space-y-2.5">
      {/* Nombre del campo */}
      <div className="flex items-end gap-2">
        <div className="flex-1 min-w-0">
          <label className="text-xs font-semibold text-slate-600 flex items-center gap-0.5">
            Pregunta o Nombre del Campo
            {field.required && <span className="text-red-500 text-[10px]">*</span>}
          </label>
          <input
            type="text"
            value={field.fieldLabel}
            onChange={(e) => {
              const label = e.target.value;
              onUpdate({
                fieldLabel: label,
                fieldKey: labelToKey(label),
              });
            }}
            placeholder="Ej: ¿Cuál es tu disponibilidad?"
            className={`mt-1 ${inputClasses}`}
          />
        </div>
        <button
          type="button"
          onClick={() => onUpdate({ required: !field.required })}
          className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition-all whitespace-nowrap flex-shrink-0 border ${
            field.required
              ? "bg-red-100 text-red-600 border-red-300"
              : "bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300"
          }`}
        >
          {field.required ? "R" : "O"}
        </button>
      </div>

      {/* Tipo de campo */}
      <div>
        <label className="text-xs font-semibold text-slate-600">Tipo de Respuesta</label>
        <select
          value={field.fieldType}
          onChange={(e) =>
            onUpdate({
              fieldType: e.target.value as Field["fieldType"],
              optionsJson: e.target.value === "select" ? ["Opción 1", "Opción 2"] : [],
            })
          }
          className={`mt-1 ${inputClasses}`}
        >
          <option value="text">Texto corto</option>
          <option value="email">Email</option>
          <option value="phone">Teléfono</option>
          <option value="textarea">Párrafo largo</option>
          <option value="select">Opción múltiple (Select)</option>
          <option value="checkbox">Checkbox (Sí/No)</option>
        </select>
      </div>

      {/* Placeholder */}
      <div>
        <label className="text-xs font-semibold text-slate-600">Texto de Ayuda (Opcional)</label>
        <input
          type="text"
          value={field.placeholder}
          onChange={(e) => onUpdate({ placeholder: e.target.value })}
          placeholder="Ej: Selecciona el horario que mejor te acomoda"
          className={`mt-1 ${inputClasses}`}
        />
      </div>

      {/* Opciones (solo para select) */}
      {field.fieldType === "select" && (
        <div>
          <label className="text-xs font-semibold text-slate-600">Opciones (Separadas por Coma)</label>
          <textarea
            value={field.optionsJson.join(", ")}
            onChange={(e) =>
              onUpdate({
                optionsJson: e.target.value
                  .split(",")
                  .map((o) => o.trim())
                  .filter(Boolean),
              })
            }
            placeholder="Opción 1, Opción 2, Opción 3"
            rows={2}
            className={`mt-1 resize-none ${inputClasses}`}
          />
          <p className="text-xs text-slate-500 mt-1">Las opciones se separan con comas</p>
        </div>
      )}
    </div>
  );
}
