import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { getUserCommunities, getMyCommunityRequests, getPendingCommunityRequests, getUserProfile } from "@/lib/queries";
import CommunityRequestActions from "./CommunityRequestActions";

const ROLE_LABELS: Record<string, string> = {
  lider: "Lider",
  admin: "Admin",
  miembro: "Miembro",
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  solicitud: {
    label: "Pendiente revisión",
    color: "bg-amber-100 text-amber-700",
  },
  rechazado: {
    label: "Rechazada",
    color: "bg-red-100 text-red-700",
  },
};

export default async function CommunitiesPage(props: {
  searchParams: Promise<{ submitted?: string }>;
}) {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  const searchParams = await props.searchParams;
  const showSubmittedBanner = searchParams.submitted === "1";

  const [communities, myCommunityRequests, profile] = await Promise.all([
    getUserCommunities(user.id),
    getMyCommunityRequests(user.id),
    getUserProfile(user.id),
  ]);

  const isAdmin = profile?.role === "admin";
  const pendingRequests = isAdmin ? await getPendingCommunityRequests() : [];

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      {showSubmittedBanner && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 flex items-center gap-3">
          <span className="material-symbols-outlined text-emerald-600">check_circle</span>
          <p className="text-emerald-800 font-medium">
            ¡Solicitud enviada! Un administrador revisará tu solicitud pronto.
          </p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Mis Comunidades</h2>
          <p className="text-slate-500 mt-1">Gestiona y explora tus comunidades.</p>
        </div>
        <Link
          href="/dashboard/communities/new"
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#f49d25] text-white font-bold shadow-lg shadow-[#f49d25]/20 hover:brightness-105 transition-all"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Solicitar Comunidad
        </Link>
      </div>

      {/* Admin: Pending community requests */}
      {isAdmin && pendingRequests.length > 0 && (
        <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-600">schedule</span>
              Solicitudes Pendientes ({pendingRequests.length})
            </h3>
          </div>
          <div className="divide-y divide-slate-100">
            {pendingRequests.map((req) => (
              <div key={req.id} className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900 text-lg">{req.name}</h4>
                    <p className="text-sm text-slate-500 mt-1">
                      Solicitado por: <span className="font-semibold">{req.creatorName}</span> • {req.createdAt}
                    </p>
                    {req.description && (
                      <p className="text-sm text-slate-600 mt-2">{req.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end">
                  <CommunityRequestActions communityId={req.id} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* User: My community requests */}
      {myCommunityRequests.length > 0 && (
        <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-bold text-lg text-slate-900">Mis Solicitudes</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {myCommunityRequests.map((req) => (
              <div
                key={req.id}
                className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900">{req.name}</h4>
                  <p className="text-sm text-slate-500 mt-0.5">{req.createdAt}</p>
                  {req.status === "rechazado" && req.rejectionReason && (
                    <div className="mt-2 bg-red-50 border border-red-100 rounded px-3 py-2 text-xs text-red-700">
                      <p className="font-semibold">Motivo del rechazo:</p>
                      <p>{req.rejectionReason}</p>
                    </div>
                  )}
                </div>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_LABELS[req.status].color}`}
                >
                  {STATUS_LABELS[req.status].label}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Approved communities */}
      {communities.length === 0 && myCommunityRequests.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <div className="size-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-3xl text-slate-400">groups</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Sin comunidades</h3>
          <p className="text-sm text-slate-500 mb-6">Solicita una comunidad para organizar eventos con tu equipo.</p>
          <Link
            href="/dashboard/communities/new"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#f49d25] text-white font-bold"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Solicitar Comunidad
          </Link>
        </div>
      ) : communities.length > 0 ? (
        <div>
          <h3 className="font-bold text-lg text-slate-900 mb-4">Comunidades Activas</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {communities.map((c) => (
              <Link
                key={c.id}
                href={`/dashboard/communities/${c.slug}`}
                className="bg-white rounded-xl border border-slate-200 p-6 hover:border-[#f49d25]/30 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="size-12 bg-[#f49d25]/10 rounded-lg flex items-center justify-center text-[#f49d25]">
                    <span className="material-symbols-outlined text-2xl">groups</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 group-hover:text-[#f49d25] transition-colors truncate">{c.name}</h3>
                    <p className="text-sm text-slate-500">{ROLE_LABELS[c.role]}</p>
                  </div>
                  <span className="material-symbols-outlined text-slate-300 group-hover:text-[#f49d25] transition-colors">
                    arrow_forward_ios
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
