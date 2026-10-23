export type UserRole = "FACILITY" | "SECURITY" | "FRONTDESK" | "ADMIN" | "HOST";
export type ApiUserRole =
  | UserRole
  | "Facility"
  | "Security"
  | "Frontdesk"
  | "Admin"
  | "Host";

export function normalizeUserRole(role: string): UserRole {
  switch (role.trim().toUpperCase()) {
    case "FACILITY":
      return "FACILITY";
    case "SECURITY":
      return "SECURITY";
    case "FRONTDESK":
      return "FRONTDESK";
    case "ADMIN":
      return "ADMIN";
    case "HOST":
      return "HOST";
    default:
      throw new Error(`Unsupported user role: ${role}`);
  }
}

export const facilityRoles: UserRole[] = ["FACILITY"];
export const securityRoles: UserRole[] = ["SECURITY"];
export const frontdeskRoles: UserRole[] = ["FRONTDESK"];
export const adminRoles: UserRole[] = ["ADMIN"];
export const appointmentRoles: UserRole[] = [
  "FACILITY",
  "SECURITY",
  "FRONTDESK",
  "ADMIN",
  "HOST",
];
export const checkInRoles: UserRole[] = ["FACILITY", "SECURITY", "FRONTDESK", "ADMIN"];
export const visitorRoles: UserRole[] = ["FACILITY", "SECURITY", "FRONTDESK", "ADMIN"];
export const dashboardRoles: UserRole[] = ["FACILITY", "SECURITY", "FRONTDESK", "ADMIN"];
export const settingsRoles: UserRole[] = ["FACILITY", "ADMIN"];
export const adminManagementRoles: UserRole[] = ["FACILITY", "ADMIN"];
