"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", icon: "dashboard", label: "Dashboard", exact: true },
  { href: "/dashboard/events", icon: "calendar_today", label: "Eventos" },
  { href: "/dashboard/volunteers", icon: "group", label: "Voluntarios" },
  { href: "/dashboard/institutions", icon: "corporate_fare", label: "Instituciones" },
  { href: "/dashboard/analytics", icon: "analytics", label: "Métricas" },
  { href: "/dashboard/reviews", icon: "star", label: "Reseñas" },
];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const isActive = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
              isActive
                ? "bg-[#f49d25] text-white"
                : "text-slate-600 hover:bg-[#f49d25]/10 hover:text-[#f49d25]"
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="text-sm">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
