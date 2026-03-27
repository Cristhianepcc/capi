import { cookies } from "next/headers";
import { getReviews, getEvents } from "@/lib/queries";
import ReviewActions from "./ReviewActions";

const roleColor: Record<string, string> = {
  Voluntaria: "bg-[#f49d25]/10 text-[#f49d25]",
  Voluntario: "bg-[#f49d25]/10 text-[#f49d25]",
  "Institucion": "bg-blue-100 text-blue-700",
  "Institución": "bg-blue-100 text-blue-700",
  Profesor: "bg-purple-100 text-purple-700",
};

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          className={`material-symbols-outlined text-base ${s <= rating ? "text-[#f49d25]" : "text-slate-200"}`}
          style={{ fontVariationSettings: s <= rating ? "'FILL' 1" : "'FILL' 0" }}
        >
          star
        </span>
      ))}
    </div>
  );
}

export default async function ReviewsPage() {
  const cookieStore = await cookies();
  const activeCommunityId = cookieStore.get("capi-community")?.value ?? undefined;

  const [reviews, events] = await Promise.all([
    getReviews(activeCommunityId),
    getEvents(true, activeCommunityId),
  ]);
  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";
  const five = reviews.filter((r) => r.rating === 5).length;
  const four = reviews.filter((r) => r.rating === 4).length;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Reseñas y Evaluaciones</h2>
        <p className="text-slate-500 mt-1">Feedback de voluntarios e instituciones sobre tus eventos.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rating summary */}
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm flex flex-col items-center justify-center gap-3 lg:col-span-1">
          <p className="text-7xl font-black text-slate-900">{avgRating}</p>
          <Stars rating={Math.round(Number(avgRating))} />
          <p className="text-sm text-slate-500">{reviews.length} reseñas en total</p>
          <div className="w-full space-y-2 mt-4">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter((r) => r.rating === star).length;
              const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 w-2">{star}</span>
                  <span className="material-symbols-outlined text-[#f49d25] text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#f49d25] rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-slate-400 w-4">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Reseñas 5 estrellas", value: five, icon: "star", color: "text-[#f49d25]", bg: "bg-[#f49d25]/10" },
            { label: "Reseñas 4 estrellas", value: four, icon: "star_half", color: "text-amber-500", bg: "bg-amber-50" },
            { label: "Satisfacción general", value: `${avgRating}/5`, icon: "thumb_up", color: "text-emerald-600", bg: "bg-emerald-100" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-3 shadow-sm">
              <div className={`size-12 rounded-xl ${s.bg} ${s.color} flex items-center justify-center`}>
                <span className="material-symbols-outlined">{s.icon}</span>
              </div>
              <p className="text-3xl font-black text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          ))}

          {/* By event breakdown */}
          <div className="sm:col-span-3 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h4 className="font-bold text-slate-900 mb-4">Reseñas por evento</h4>
            <div className="space-y-3">
              {events
                .filter((e) => reviews.some((r) => r.eventId === e.id))
                .map((event) => {
                  const eventReviews = reviews.filter((r) => r.eventId === event.id);
                  const avg = (eventReviews.reduce((s, r) => s + r.rating, 0) / eventReviews.length).toFixed(1);
                  return (
                    <div key={event.id} className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">{event.title}</p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <Stars rating={Math.round(Number(avg))} />
                        <span className="text-sm font-bold text-slate-700">{avg}</span>
                        <span className="text-xs text-slate-400">({eventReviews.length})</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg text-slate-900">Todas las reseñas</h3>
        {reviews.map((review) => {
          const event = events.find((e) => e.id === review.eventId);
          return (
            <div key={review.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-[#f49d25]/20 flex items-center justify-center text-[#f49d25] font-bold text-sm border border-[#f49d25]/30">
                    {review.author.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{review.author}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${roleColor[review.role] ?? "bg-slate-100 text-slate-600"}`}>
                        {review.role}
                      </span>
                      <span className="text-xs text-slate-400">{review.date}</span>
                    </div>
                  </div>
                </div>
                <Stars rating={review.rating} />
              </div>

              {event && (
                <p className="mt-3 text-xs text-[#f49d25] font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">event</span>
                  {event.title}
                </p>
              )}

              <p className="mt-3 text-sm text-slate-600 leading-relaxed">{review.comment}</p>

              <div className="mt-4 flex items-center gap-3 pt-4 border-t border-slate-100">
                <ReviewActions reviewId={review.id} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
