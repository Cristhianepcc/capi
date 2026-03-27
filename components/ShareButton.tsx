"use client";

import { useState } from "react";

export default function ShareButton({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    if (navigator.share) {
      await navigator.share({ title, url });
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 rounded-xl border-2 border-[#f49d25]/20 px-8 py-4 text-lg font-bold text-slate-900 hover:bg-[#f49d25]/5 transition-colors"
      aria-label="Compartir evento"
    >
      <span className="material-symbols-outlined text-lg">share</span>
      {copied ? "¡Copiado!" : "Compartir"}
    </button>
  );
}
