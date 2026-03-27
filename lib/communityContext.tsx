"use client";

import { createContext, useContext } from "react";

export interface CommunityInfo {
  id: string;
  name: string;
  slug: string;
  role: "lider" | "admin" | "miembro";
}

export interface CommunityContextValue {
  isSystemAdmin: boolean;
  fullName: string | null;
  communities: CommunityInfo[];
  activeCommunity: CommunityInfo | null;
}

const CommunityContext = createContext<CommunityContextValue>({
  isSystemAdmin: false,
  fullName: null,
  communities: [],
  activeCommunity: null,
});

export function CommunityProvider({
  isSystemAdmin,
  fullName,
  communities,
  activeCommunity,
  children,
}: CommunityContextValue & { children: React.ReactNode }) {
  return (
    <CommunityContext.Provider value={{ isSystemAdmin, fullName, communities, activeCommunity }}>
      {children}
    </CommunityContext.Provider>
  );
}

export function useCommunity() {
  return useContext(CommunityContext);
}
