import { paths } from "@/config/paths";
import type { UserRole } from "@/types/user-role";

export function getAdminHomeHref(role: UserRole): string {
  if (role === "HOST") {
    return paths.admin.appointments.getHref();
  }

  if (role === "SECURITY") {
    return paths.admin.checkIns.getHref();
  }

  if (role === "FRONTDESK") {
    return paths.admin.visitors.getHref();
  }

  return paths.admin.dashboard.getHref();
}
