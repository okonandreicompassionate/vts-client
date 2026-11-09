import { Navigate, Outlet, useLocation, useParams } from "react-router-dom";

import { Spinner } from "@/components/ui/spinner";
import PageError from "@/components/feedback/page-error";
import { useGetPublicOrganizationQuery } from "../api/organizations-api-slice";
import { switchOrganizationPath } from "@/utils/organization-path";

/**
 * Wraps the public visitor pages (`/:orgSlug/...`). Resolves the slug,
 * sends links that use an old slug to the current one, and shows a
 * not-found page for unknown organizations.
 */
export function OrganizationLayout() {
  const { orgSlug = "" } = useParams<{ orgSlug: string }>();
  const location = useLocation();
  const {
    data: organization,
    error,
    isLoading,
  } = useGetPublicOrganizationQuery(orgSlug, {
    skip: !orgSlug,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
    pollingInterval: 15000,
  });

  if (isLoading) {
    return <Spinner variant="screen" />;
  }

  if (error) {
    const status = "status" in error ? error.status : undefined;

    return (
      <PageError
        error={new Error(status === 404 ? "Page not found" : "This organization is unavailable.")}
        resetErrorBoundary={() => window.location.reload()}
      />
    );
  }

  if (organization && organization.slug !== orgSlug.toLowerCase()) {
    return (
      <Navigate
        to={`${switchOrganizationPath(location.pathname, organization.slug)}${location.search}`}
        replace
      />
    );
  }

  return <Outlet />;
}
