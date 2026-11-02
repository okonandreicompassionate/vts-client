export function organizationPath(orgSlug: string, path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `/${orgSlug}${normalizedPath}`;
}

/** Same page under another slug - used when an organization's slug changed. */
export function switchOrganizationPath(pathname: string, orgSlug: string): string {
  const segments = pathname.split("/");
  segments[1] = orgSlug;
  return segments.join("/");
}

/** Server routes for a public visitor link: `/v/:orgSlug/...`. */
export function publicOrganizationApiPath(orgSlug: string, path = ""): string {
  const normalizedPath = path && !path.startsWith("/") ? `/${path}` : path;

  return `/v/${encodeURIComponent(orgSlug)}${normalizedPath}`;
}
