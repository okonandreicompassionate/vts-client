export function tenantPath(orgSlug: string, path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `/${orgSlug}${normalizedPath}`;
}
