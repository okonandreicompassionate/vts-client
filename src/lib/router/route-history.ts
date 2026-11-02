const PREVIOUS_ROUTE_KEY = "vts_previous_route";

export type AppRouteArea = "visitor" | "admin";

export interface PreviousRoute {
  pathname: string;
  /** Only visitor pages carry an organization in the URL. */
  orgSlug: string | null;
  area: AppRouteArea;
}

// First path segments of admin pages. Organizations can't use these as slugs.
const ADMIN_SEGMENTS = new Set([
  "login",
  "signup",
  "dashboard",
  "appointments",
  "check-ins",
  "visitors",
  "settings",
  "employees",
  "users",
]);

export function getRouteArea(pathname: string): AppRouteArea {
  const [firstSegment] = pathname.split("/").filter(Boolean);

  return firstSegment && ADMIN_SEGMENTS.has(firstSegment) ? "admin" : "visitor";
}

export function rememberRoute(pathname: string): void {
  const area = getRouteArea(pathname);
  const [firstSegment] = pathname.split("/").filter(Boolean);

  const route: PreviousRoute = {
    pathname,
    orgSlug: area === "visitor" ? (firstSegment ?? null) : null,
    area,
  };

  try {
    sessionStorage.setItem(PREVIOUS_ROUTE_KEY, JSON.stringify(route));
  } catch {
    // Storage can be unavailable (private mode); history is only a convenience.
  }
}

export function getPreviousRoute(): PreviousRoute | null {
  let stored: string | null;

  try {
    stored = sessionStorage.getItem(PREVIOUS_ROUTE_KEY);
  } catch {
    return null;
  }

  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as PreviousRoute;
  } catch {
    sessionStorage.removeItem(PREVIOUS_ROUTE_KEY);
    return null;
  }
}
