"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteReview } from "@/lib/actions/reviews";
import { useToast } from "@/lib/useToast";

interface ReviewActionsProps {
  reviewId: string;
}

export default function ReviewActions({ reviewId }: ReviewActionsProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm("¿Estás seguro de que deseas eliminar esta reseña?");
    if (!confirmed) return;

    setLoading(true);
    const result = await deleteReview(reviewId);
    if (result.error) {
      showToast(result.error, "error");
    } else {
      showToast("Reseña eliminada correctamente", "success");
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50"
      title="Eliminar reseña"
    >
      <span className="material-symbols-outlined text-xs">delete</span>
      Eliminar
    </button>
  );
}
