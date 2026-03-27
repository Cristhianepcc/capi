"use client";

import { useRouter } from "next/navigation";
import { updateVolunteerStatus } from "@/lib/actions/volunteers";
import { useToast } from "@/lib/useToast";

interface DashboardActionsProps {
  applicationId: string;
}

export default function DashboardActions({ applicationId }: DashboardActionsProps) {
  const router = useRouter();
  const { showToast } = useToast();

  async function handleApprove() {
    const result = await updateVolunteerStatus(applicationId, "aprobado");
    if (result.error) {
      showToast(result.error, "error");
    } else {
      showToast("Postulación aprobada", "success");
      router.refresh();
    }
  }

  async function handleReject() {
    const result = await updateVolunteerStatus(applicationId, "rechazado");
    if (result.error) {
      showToast(result.error, "error");
    } else {
      showToast("Postulación rechazada", "success");
      router.refresh();
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleApprove}
        className="px-4 py-2 bg-[#f49d25]/10 text-[#f49d25] hover:bg-[#f49d25] hover:text-white rounded-lg text-sm font-bold transition-all"
      >
        Aprobar
      </button>
      <button
        onClick={handleReject}
        className="px-4 py-2 bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg text-sm font-bold transition-all"
      >
        Rechazar
      </button>
    </div>
  );
}
