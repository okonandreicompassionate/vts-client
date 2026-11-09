import { paths } from "@/config/paths";
import { checkInRoles, hasRole, type UserRole } from "@/types/user-role";
import type { NotificationType } from "../types/notifications-api.types";

// Notifications about the visitor being (or about to be) on site belong to the gate.
const GATE_TYPES: NotificationType[] = [
  "VISIT_READY_FOR_CHECKIN",
  "VISIT_CHECKED_IN",
  "VISIT_CHECKED_OUT",
  "VISIT_OVERSTAYED",
];

/** The page a notification opens for this role. */
export function notificationHref(type: NotificationType, role: UserRole | undefined): string {
  return GATE_TYPES.includes(type) && hasRole(role, checkInRoles)
    ? paths.admin.checkIns.getHref()
    : paths.admin.appointments.getHref();
}
