"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCommunity, type CommunityInfo } from "@/lib/communityContext";

const ROLE_LABELS: Record<string, string> = {
  lider: "Lider",
  admin: "Admin",
  miembro: "Miembro",
};

export default function CommunitySwitcher() {
  const { communities, activeCommunity } = useCommunity();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function selectCommunity(community: CommunityInfo | null) {
    if (community) {
      document.cookie = `capi-community=${community.id};path=/;max-age=${60 * 60 * 24 * 365}`;
    } else {
      document.cookie = "capi-community=;path=/;max-age=0";
    }
    setOpen(false);
    router.refresh();
  }

  if (communities.length === 0) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
      >
        <span className="material-symbols-outlined text-[#f49d25] text-lg">groups</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-slate-900 truncate">
            {activeCommunity?.name ?? "Vista personal"}
          </p>
          <p className="text-[10px] text-slate-500">
            {activeCommunity ? ROLE_LABELS[activeCommunity.role] : "Sin comunidad"}
          </p>
        </div>
        <span className="material-symbols-outlined text-slate-400 text-sm">unfold_more</span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 overflow-hidden">
          <button
            onClick={() => selectCommunity(null)}
            className={`w-full text-left px-3 py-2.5 text-sm hover:bg-slate-50 transition-colors flex items-center gap-2 ${
              !activeCommunity ? "bg-[#f49d25]/5 text-[#f49d25] font-semibold" : "text-slate-600"
            }`}
          >
            <span className="material-symbols-outlined text-sm">person</span>
            Vista personal
          </button>
          <div className="border-t border-slate-100" />
          {communities.map((c) => (
            <button
              key={c.id}
              onClick={() => selectCommunity(c)}
              className={`w-full text-left px-3 py-2.5 text-sm hover:bg-slate-50 transition-colors flex items-center justify-between ${
                activeCommunity?.id === c.id ? "bg-[#f49d25]/5 text-[#f49d25] font-semibold" : "text-slate-600"
              }`}
            >
              <span className="truncate">{c.name}</span>
              <span className="text-[10px] text-slate-400 flex-shrink-0 ml-2">{ROLE_LABELS[c.role]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
