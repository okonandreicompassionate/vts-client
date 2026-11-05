import { useMatches } from "react-router-dom";

/** Static route metadata, set as `handle` on a route object. */
export interface RouteHandle {
  /** Shown as the last item of the staff top bar's breadcrumb. */
  breadcrumb?: string;
}

/** The breadcrumb of the deepest matched route that declares one. */
export function useRouteBreadcrumb() {
  const matches = useMatches();

  for (let index = matches.length - 1; index >= 0; index -= 1) {
    const breadcrumb = (matches[index].handle as RouteHandle | undefined)?.breadcrumb;
    if (breadcrumb) return breadcrumb;
  }

  return undefined;
}
