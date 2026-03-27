import { cookies } from "next/headers";
import { getInstitutions } from "@/lib/queries";
import InstitutionsClient from "./InstitutionsClient";

export default async function InstitutionsPage() {
  const cookieStore = await cookies();
  const activeCommunityId = cookieStore.get("capi-community")?.value ?? undefined;

  const institutions = await getInstitutions(activeCommunityId);
  return <InstitutionsClient initialInstitutions={institutions} />;
}
