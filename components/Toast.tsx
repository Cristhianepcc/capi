"use client";

import { useToast, type ToastType } from "@/lib/useToast";

const typeStyles: Record<ToastType, string> = {
  success: "bg-emerald-600",
  error: "bg-red-600",
  info: "bg-slate-700",
};

const typeIcons: Record<ToastType, string> = {
  success: "check_circle",
  error: "error",
  info: "info",
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${typeStyles[toast.type]} text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 min-w-72 animate-[slideUp_0.3s_ease-out]`}
        >
          <span className="material-symbols-outlined text-sm">{typeIcons[toast.type]}</span>
          <span className="text-sm font-medium flex-1">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-white/70 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      ))}
    </div>
  );
}
