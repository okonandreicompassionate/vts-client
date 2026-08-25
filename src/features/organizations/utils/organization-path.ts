export function organizationPath(orgSlug: string, path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `/${orgSlug}${normalizedPath}`;
}

export function switchOrganizationPath(
  pathname: string,
  orgSlug: string,
): string {
  const segments = pathname.split("/");
  segments[1] = orgSlug;
  return segments.join("/");
}