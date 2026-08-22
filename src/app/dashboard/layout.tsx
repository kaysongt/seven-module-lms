import { PortalShell } from "@/components/portal-shell";
import { requireUser } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return <PortalShell user={user}>{children}</PortalShell>;
}
