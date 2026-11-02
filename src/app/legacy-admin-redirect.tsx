import { Navigate, useLocation, useParams } from "react-router-dom";

import PageError from "@/components/feedback/page-error";
import { getRouteArea } from "@/lib/router/route-history";

/**
 * Staff pages used to live under the organization slug (`/acme/dashboard`).
 * Sends those old bookmarks and email links to the slug-free page.
 */
export function LegacyAdminRedirect() {
  const { "*": rest = "" } = useParams();
  const { search } = useLocation();
  const target = `/${rest}`;

  if (rest && getRouteArea(target) === "admin") {
    return <Navigate to={`${target}${search}`} replace />;
  }

  return <PageError error={new Error("Page not found")} resetErrorBoundary={() => {}} />;
}
