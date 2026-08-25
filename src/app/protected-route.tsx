import { Navigate, Outlet } from "react-router-dom";

import { paths } from "../config/paths";
import { useOrganization } from "@/features/organizations";
import { Spinner } from "@/components/ui/spinner";
import { useGetProfileQuery } from "@/features/settings/api/settings-api-slice";

interface ProtectedRouteProps {
  requiredAuth?: "admin" | "visitor" | "visitor-verified";
}

export function ProtectedRoute({
  requiredAuth = "admin",
}: ProtectedRouteProps) {
  const { orgSlug } = useOrganization();

  const {
    data: user,
    isLoading,
    isError,
  } = useGetProfileQuery(undefined, {
    skip: requiredAuth !== "admin",
  });

  if (requiredAuth === "admin") {
    if (isLoading) {
      return <Spinner variant="screen" />;
    }

    if (isError || !user) {
      return (
        <Navigate
          to={paths.admin.login.getHref(orgSlug)}
          replace
        />
      );
    }
  }

  return <Outlet />;
}