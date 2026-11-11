/** Client role names. The server calls hosts "USER"; everything else matches. */
export type UserRole = "SUPERADMIN" | "ADMIN" | "FACILITY" | "SECURITY" | "FRONTDESK" | "HOST";
export type ApiUserRole =
  | UserRole
  | "USER"
  | "Superadmin"
  | "Facility"
  | "Security"
  | "Frontdesk"
  | "Admin"
  | "Host"
  | "User";

export function normalizeUserRole(role: string): UserRole {
  switch (role.trim().toUpperCase()) {
    case "SUPERADMIN":
      return "SUPERADMIN";
    case "ADMIN":
      return "ADMIN";
    case "FACILITY":
      return "FACILITY";
    case "SECURITY":
      return "SECURITY";
    case "FRONTDESK":
      return "FRONTDESK";
    case "HOST":
    case "USER":
      return "HOST";
    default:
      throw new Error(`Unsupported user role: ${role}`);
  }
}

/** Role name the server expects (hosts are "USER" on the server). */
export function toApiRole(role: UserRole): string {
  return role === "HOST" ? "USER" : role;
}

export const facilityRoles: UserRole[] = ["FACILITY"];
export const securityRoles: UserRole[] = ["SECURITY"];
export const frontdeskRoles: UserRole[] = ["FRONTDESK"];
export const adminRoles: UserRole[] = ["SUPERADMIN", "ADMIN"];
export const appointmentRoles: UserRole[] = [
  "SUPERADMIN",
  "ADMIN",
  "FACILITY",
  "SECURITY",
  "FRONTDESK",
  "HOST",
];
export const checkInRoles: UserRole[] = [
  "SUPERADMIN",
  "ADMIN",
  "FACILITY",
  "SECURITY",
  "FRONTDESK",
];
export const checkOutRoles: UserRole[] = ["SUPERADMIN", "ADMIN", "FACILITY", "FRONTDESK"];
export const visitorRoles: UserRole[] = [
  "SUPERADMIN",
  "ADMIN",
  "FACILITY",
  "SECURITY",
  "FRONTDESK",
];
export const dashboardRoles: UserRole[] = [
  "SUPERADMIN",
  "ADMIN",
  "FACILITY",
  "SECURITY",
  "FRONTDESK",
];
export const settingsRoles: UserRole[] = ["SUPERADMIN", "ADMIN", "FACILITY"];
/** Server: approve/reject visits. */
export const reviewerRoles: UserRole[] = ["SUPERADMIN", "ADMIN", "FACILITY"];
/** Server: /employees*. */
export const employeeManagementRoles: UserRole[] = ["SUPERADMIN", "ADMIN", "FACILITY"];
/** Server: admins list, invites and organization settings are superadmin-only. */
export const adminManagementRoles: UserRole[] = ["SUPERADMIN"];

export const hasRole = (role: UserRole | undefined, roles: readonly UserRole[]): boolean =>
  Boolean(role && roles.includes(role));
