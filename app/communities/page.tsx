import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPublicCommunities } from "@/lib/queries";

export default async function CommunitiesPage() {
  const communities = await getPublicCommunities();

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f7f5]">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-6 lg:px-10 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Comunidades</h1>
          <p className="mt-2 text-slate-600 text-lg">
            Conoce a las comunidades que organizan eventos de impacto social.
          </p>
        </div>

        {communities.length === 0 ? (
          <div className="py-24 text-center text-slate-400">
            <span className="material-symbols-outlined text-5xl mb-3 block">groups</span>
            <p className="text-lg font-semibold">Aun no hay comunidades</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communities.map((community) => (
              <Link
                key={community.id}
                href={`/communities/${community.slug}`}
                className="group flex flex-col rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Header color bar */}
                <div className="h-2 bg-[#f49d25]" />
                <div className="p-6 flex flex-col gap-4 flex-1">
                  <div className="flex items-center gap-4">
                    <div className="size-14 bg-[#f49d25]/10 rounded-xl flex items-center justify-center text-[#f49d25] flex-shrink-0">
                      <span className="material-symbols-outlined text-3xl">groups</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#f49d25] transition-colors truncate">
                        {community.name}
                      </h3>
                    </div>
                  </div>

                  {community.description && (
                    <p className="text-sm text-slate-500 line-clamp-2">{community.description}</p>
                  )}

                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center gap-6">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <span className="material-symbols-outlined text-sm">person</span>
                      <span className="text-sm font-medium">{community.membersCount} miembros</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <span className="material-symbols-outlined text-sm">event</span>
                      <span className="text-sm font-medium">{community.eventsCount} eventos</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
