"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCommunity } from "@/lib/communityContext";

interface NavItem {
  href: string;
  icon: string;
  label: string;
  exact?: boolean;
}

export default function SidebarNav() {
  const pathname = usePathname();
  const { isSystemAdmin, activeCommunity } = useCommunity();

  const navItems: NavItem[] = [];

  // System admin view - always show admin modules
  if (isSystemAdmin) {
    navItems.push({ href: "/dashboard", icon: "dashboard", label: "Dashboard", exact: true });
    navItems.push({ href: "/dashboard/events", icon: "calendar_today", label: "Eventos" });
    navItems.push({ href: "/dashboard/volunteers", icon: "group", label: "Voluntarios" });
    navItems.push({ href: "/dashboard/institutions", icon: "corporate_fare", label: "Instituciones" });
    navItems.push({ href: "/dashboard/analytics", icon: "analytics", label: "Metricas" });
    navItems.push({ href: "/dashboard/reviews", icon: "star", label: "Resenas" });
    navItems.push({ href: "/dashboard/users", icon: "manage_accounts", label: "Usuarios" });
    navItems.push({ href: "/dashboard/permissions", icon: "admin_panel_settings", label: "Permisos" });
  } else if (activeCommunity) {
    // Community admin/leader view
    const communityRole = activeCommunity.role;
    const isLeaderOrAdmin = communityRole === "lider" || communityRole === "admin";

    if (isLeaderOrAdmin) {
      navItems.push({ href: "/dashboard", icon: "dashboard", label: "Dashboard", exact: true });
    }
    navItems.push({ href: "/dashboard/events", icon: "calendar_today", label: "Eventos" });
    if (isLeaderOrAdmin) {
      navItems.push({ href: "/dashboard/volunteers", icon: "group", label: "Voluntarios" });
      navItems.push({ href: "/dashboard/institutions", icon: "corporate_fare", label: "Instituciones" });
      navItems.push({ href: "/dashboard/analytics", icon: "analytics", label: "Metricas" });
      navItems.push({ href: "/dashboard/reviews", icon: "star", label: "Resenas" });
    }
    if (communityRole === "lider") {
      navItems.push({ href: `/dashboard/communities/${activeCommunity.slug}/members`, icon: "manage_accounts", label: "Miembros" });
    }
  } else {
    // Personal view
    navItems.push({ href: "/dashboard/my-events", icon: "calendar_today", label: "Mis Eventos" });
    navItems.push({ href: "/dashboard/profile", icon: "person", label: "Mi Perfil" });
    navItems.push({ href: "/dashboard/communities", icon: "groups", label: "Mis Comunidades" });
  }

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
