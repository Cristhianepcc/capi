"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { approveCommunityRequest, rejectCommunityRequest } from "@/lib/actions/communities";

interface CommunityRequestActionsProps {
  communityId: string;
}

export default function CommunityRequestActions({
  communityId,
}: CommunityRequestActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [error, setError] = useState("");

  async function handleApprove() {
    setLoading(true);
    setError("");

    const result = await approveCommunityRequest(communityId);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setLoading(false);
    router.refresh();
  }

  async function handleReject() {
    setLoading(true);
    setError("");

    const result = await rejectCommunityRequest(communityId, rejectionReason);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      {showRejectModal ? (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-lg text-slate-900">Rechazar solicitud</h3>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2">
                Motivo del rechazo (opcional)
              </label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explica brevemente por qué se rechaza..."
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason("");
                  setError("");
                }}
                disabled={loading}
                className="flex-1 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleReject}
                disabled={loading}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Rechazando..." : "Rechazar"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <button
            onClick={handleApprove}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700 font-semibold hover:bg-emerald-100 transition-colors disabled:opacity-50 text-sm"
          >
            <span className="material-symbols-outlined text-sm">check_circle</span>
            Aprobar
          </button>
          <button
            onClick={() => setShowRejectModal(true)}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-50 text-red-700 font-semibold hover:bg-red-100 transition-colors disabled:opacity-50 text-sm"
          >
            <span className="material-symbols-outlined text-sm">cancel</span>
            Rechazar
          </button>
        </>
      )}
    </div>
  );
}
