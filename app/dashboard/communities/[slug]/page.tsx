import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { getCommunityBySlug, getCommunityMembers, getCommunityEvents } from "@/lib/queries";

export default async function CommunityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await getAuthUser();
  if (!user) redirect("/login");

  const community = await getCommunityBySlug(slug);
  if (!community) notFound();

  const [members, events] = await Promise.all([
    getCommunityMembers(community.id),
    getCommunityEvents(community.id),
  ]);

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/communities"
          className="size-10 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-[#f49d25] transition-colors"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
        </Link>
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">{community.name}</h2>
          {community.description && (
            <p className="text-slate-500 mt-0.5">{community.description}</p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <p className="text-sm text-slate-500">Miembros</p>
          <p className="text-3xl font-bold text-slate-900">{members.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <p className="text-sm text-slate-500">Eventos</p>
          <p className="text-3xl font-bold text-slate-900">{events.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <p className="text-sm text-slate-500">Estado</p>
          <p className="text-3xl font-bold text-slate-900 capitalize">{community.status}</p>
        </div>
      </div>

      {/* Members preview */}
      <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-lg text-slate-900">Miembros</h3>
          <Link
            href={`/dashboard/communities/${slug}/members`}
            className="text-[#f49d25] text-sm font-semibold hover:underline"
          >
            Gestionar
          </Link>
        </div>
        <div className="divide-y divide-slate-100">
          {members.slice(0, 5).map((m) => (
            <div key={m.id} className="px-6 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">{m.fullName}</p>
                <p className="text-xs text-slate-500">Desde {m.joinedAt}</p>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full capitalize ${
                m.role === "lider" ? "bg-[#f49d25]/10 text-[#f49d25]" :
                m.role === "admin" ? "bg-blue-100 text-blue-700" :
                "bg-slate-100 text-slate-600"
              }`}>
                {m.role}
              </span>
            </div>
          ))}
          {members.length === 0 && (
            <div className="p-6 text-center text-slate-400 text-sm">Sin miembros.</div>
          )}
        </div>
      </section>

      {/* Website */}
      {community.website && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <p className="text-sm text-slate-500 mb-1">Sitio web</p>
          <a href={community.website} target="_blank" rel="noopener noreferrer" className="text-[#f49d25] font-semibold hover:underline">
            {community.website}
          </a>
        </div>
      )}
    </div>
  );
}
