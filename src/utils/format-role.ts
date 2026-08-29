export function formatRole(role?: string | null): string {
  if (!role) return "Admin";

  if (role === "SUPERADMIN") return "Super Admin";

  return role
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
