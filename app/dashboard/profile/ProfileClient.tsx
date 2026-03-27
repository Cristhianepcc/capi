"use client";

interface ProfileStats {
  totalEvents: number;
  totalHours: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
}

export default function ProfileClient({
  fullName,
  email,
  stats,
}: {
  fullName: string;
  email: string;
  stats: ProfileStats;
}) {
  const initials = fullName
    ? fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : email.slice(0, 2).toUpperCase();

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8">
      <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Mi Perfil</h2>

      {/* Profile card */}
      <div className="bg-white rounded-xl border border-slate-200 p-8">
        <div className="flex items-center gap-6">
          <div className="size-20 rounded-full bg-[#f49d25]/20 flex items-center justify-center text-[#f49d25] font-bold text-2xl border-2 border-[#f49d25]/30">
            {initials}
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">{fullName || "Voluntario"}</h3>
            <p className="text-sm text-slate-500">{email}</p>
            <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
              Voluntario
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Eventos", value: stats.totalEvents, icon: "calendar_today", color: "text-[#f49d25]", bg: "bg-[#f49d25]/10" },
          { label: "Horas", value: stats.totalHours, icon: "schedule", color: "text-blue-600", bg: "bg-blue-100" },
          { label: "Aprobados", value: stats.approvedCount, icon: "check_circle", color: "text-emerald-600", bg: "bg-emerald-100" },
          { label: "Pendientes", value: stats.pendingCount, icon: "hourglass_top", color: "text-yellow-600", bg: "bg-yellow-100" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-5 text-center">
            <span className={`material-symbols-outlined ${s.color} ${s.bg} p-2 rounded-lg mb-2 inline-block`}>
              {s.icon}
            </span>
            <p className="text-2xl font-bold text-slate-900">{s.value}</p>
            <p className="text-xs text-slate-500 font-medium">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
