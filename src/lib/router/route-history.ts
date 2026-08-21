const PREVIOUS_ROUTE_KEY = "vts_previous_route";

export type AppRouteArea = "visitor" | "admin";

export interface PreviousRoute {
  pathname: string;
  orgSlug: string | null;
  area: AppRouteArea;
}

const VISITOR_SEGMENTS = new Set([
  "register",
  "verify",
  "profile",
]);

export function getOrgSlug(pathname: string): string | null {
  const [, orgSlug] = pathname.split("/");

  return orgSlug || null;
}

export function getRouteArea(pathname: string): AppRouteArea {
  const segments = pathname.split("/").filter(Boolean);
  const secondSegment = segments[1];

  if (!secondSegment || VISITOR_SEGMENTS.has(secondSegment)) {
    return "visitor";
  }

  return "admin";
}

export function rememberRoute(pathname: string): void {
  const route: PreviousRoute = {
    pathname,
    orgSlug: getOrgSlug(pathname),
    area: getRouteArea(pathname),
  };

  sessionStorage.setItem(PREVIOUS_ROUTE_KEY, JSON.stringify(route));
}

export function getPreviousRoute(): PreviousRoute | null {
  const stored = sessionStorage.getItem(PREVIOUS_ROUTE_KEY);

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