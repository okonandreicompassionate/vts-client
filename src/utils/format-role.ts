export function formatRole(role?: string | null): string {
  if (!role) return "Admin";

  if (["HOST", "USER"].includes(role.trim().toUpperCase())) return "User";

  return role
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
