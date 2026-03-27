"use client";

import { ToastContext, useToastState } from "@/lib/useToast";
import ToastContainer from "./Toast";

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const toastState = useToastState();

  return (
    <ToastContext.Provider value={toastState}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}
