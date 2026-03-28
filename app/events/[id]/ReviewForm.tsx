"use client";

import { useState } from "react";
import Link from "next/link";
import { createReview } from "@/lib/actions/reviews";

const MAX_COMMENT_LENGTH = 500;

interface ReviewFormProps {
  eventId: string;
  userEmail: string | null;
}

export default function ReviewForm({ eventId, userEmail }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!userEmail) {
    return (
      <div className="rounded-2xl border border-[#f49d25]/10 bg-white p-8 shadow-sm text-center space-y-3">
        <span className="material-symbols-outlined text-3xl text-slate-300" aria-hidden="true">rate_review</span>
        <h3 className="text-lg font-bold text-slate-900">Deja tu Reseña</h3>
        <p className="text-sm text-slate-500">Inicia sesión para compartir tu experiencia.</p>
        <Link
          href="/login"
          className="inline-block rounded-xl bg-[#f49d25] px-6 py-2.5 font-bold text-white text-sm hover:brightness-105 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f49d25]"
        >
          Iniciar sesión
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (rating === 0) {
      setError("Selecciona una calificación");
      return;
    }

    setLoading(true);

    const result = await createReview({
      eventId,
      rating,
      comment: comment || undefined,
    });

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center space-y-3">
        <div className="size-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-2xl text-emerald-600" aria-hidden="true">check_circle</span>
        </div>
        <h3 className="text-lg font-bold text-emerald-800">¡Gracias por tu reseña!</h3>
        <p className="text-sm text-emerald-600">Tu feedback nos ayuda a mejorar nuestros eventos.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#f49d25]/10 bg-white p-8 shadow-sm">
      <h3 className="text-xl font-bold mb-2 text-slate-900">Deja tu Reseña</h3>
      <p className="text-sm text-slate-500 mb-6">Comparte tu experiencia en este evento.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3" role="alert">
            {error}
          </div>
        )}

        {/* Star rating */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700">Calificación (haz clic en las estrellas)</label>
          <div className="flex items-center gap-1" role="group" aria-label="Calificación del evento">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                aria-label={`${star} estrella${star !== 1 ? "s" : ""}`}
                aria-pressed={rating === star}
                className="p-0.5 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f49d25] rounded-sm"
              >
                <span
                  className={`material-symbols-outlined text-2xl ${
                    star <= (hoverRating || rating) ? "text-[#f49d25]" : "text-slate-200"
                  }`}
                  style={{
                    fontVariationSettings: star <= (hoverRating || rating) ? "'FILL' 1" : "'FILL' 0",
                  }}
                  aria-hidden="true"
                >
                  star
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="review-comment" className="text-sm font-semibold text-slate-700">
              Comentario <span className="text-slate-400 text-xs font-normal">(opcional)</span>
            </label>
            <span className={`text-xs ${comment.length > MAX_COMMENT_LENGTH ? "text-red-500" : "text-slate-400"}`}>
              {comment.length}/{MAX_COMMENT_LENGTH}
            </span>
          </div>
          <textarea
            id="review-comment"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={MAX_COMMENT_LENGTH}
            placeholder="Cuéntanos sobre tu experiencia..."
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#f49d25]/30 focus:border-[#f49d25] placeholder:text-slate-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#f49d25] px-6 py-3 font-bold text-white shadow-lg shadow-[#f49d25]/20 hover:brightness-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f49d25]"
        >
          <span className="material-symbols-outlined text-sm" aria-hidden="true">rate_review</span>
          {loading ? "Enviando..." : "Enviar Reseña"}
        </button>
      </form>
    </div>
  );
}
