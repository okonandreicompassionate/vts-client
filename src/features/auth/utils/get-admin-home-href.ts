import { paths } from "@/config/paths";
import type { UserRole } from "@/types/user-role";

export function getAdminHomeHref(role: UserRole, orgSlug: string): string {
  if (role === "HOST") {
    return paths.admin.appointments.getHref(orgSlug);
  }

  if (role === "SECURITY") {
    return paths.admin.checkIns.getHref(orgSlug);
  }

  if (role === "FRONTDESK") {
    return paths.admin.visitors.getHref(orgSlug);
  }

  return paths.admin.dashboard.getHref(orgSlug);
}
