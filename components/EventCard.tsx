"use client";

import Link from "next/link";
import Image from "next/image";

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  type: string;
  spotsLeft: number;
  image: string;
  communityName?: string | null;
  communitySlug?: string | null;
}

export default function EventCard({ event }: { event: Event }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:-translate-y-2 hover:shadow-2xl border border-slate-100">
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        {event.image ? (
          <Image
            src={event.image}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-300">
            <span className="material-symbols-outlined text-4xl">image</span>
          </div>
        )}
        <div className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-900 backdrop-blur-sm">
          {event.type}
        </div>
      </div>
      <div className="flex flex-col gap-2 p-6 flex-1">
        <div className="flex items-center gap-2 text-[#f49d25]">
          <span className="material-symbols-outlined text-sm">event</span>
          <span className="text-xs font-bold uppercase">{event.date} • {event.location}</span>
        </div>
        <h3 className="text-xl font-bold text-slate-900">{event.title}</h3>
        {event.communityName && (
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">groups</span>
            Organizado por{" "}
            {event.communitySlug ? (
              <Link
                href={`/communities/${event.communitySlug}`}
                className="text-[#f49d25] font-semibold hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {event.communityName}
              </Link>
            ) : (
              <span className="font-semibold">{event.communityName}</span>
            )}
          </p>
        )}
        <p className="text-sm text-slate-500 line-clamp-2 flex-1">{event.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1 text-slate-400">
            <span className="material-symbols-outlined text-sm">person</span>
            <span className="text-xs font-medium">
              {event.spotsLeft > 0 ? `${event.spotsLeft} cupos disponibles` : "Sin cupos"}
            </span>
          </div>
          <Link
            href={`/events/${event.id}`}
            className="text-sm font-bold text-[#f49d25] hover:underline underline-offset-4"
          >
            Ver mas
          </Link>
        </div>
      </div>
    </div>
  );
}
