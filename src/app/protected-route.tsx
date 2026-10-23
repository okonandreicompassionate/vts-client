import { Navigate, Outlet } from "react-router-dom";

import { paths } from "../config/paths";
import { useOrganization } from "@/features/organizations";
import { Spinner } from "@/components/ui/spinner";
import { useGetProfileQuery } from "@/features/settings/api/settings-api-slice";
import type { UserRole } from "@/types/user-role";
import { useAppSelector } from "@/lib/stores/hooks";
import { getAdminHomeHref } from "@/features/auth/utils/get-admin-home-href";

interface ProtectedRouteProps {
  requiredAuth?: "admin" | "visitor" | "visitor-verified";
  requiredRoles?: readonly UserRole[];
}

export function ProtectedRoute({ requiredAuth = "admin", requiredRoles }: ProtectedRouteProps) {
  const { orgSlug } = useOrganization();
  const sessionUser = useAppSelector((state) => state.adminAuth.user);
  const hasMatchingSession = sessionUser?.orgSlug === orgSlug;

  const {
    data: user,
    isLoading,
    isError,
  } = useGetProfileQuery(undefined, {
    skip: requiredAuth !== "admin" || hasMatchingSession,
  });

  if (requiredAuth === "admin") {
    if (isLoading && !hasMatchingSession) {
      return <Spinner variant="screen" />;
    }

    const authenticatedUser = hasMatchingSession ? sessionUser : user;

    if ((isError && !hasMatchingSession) || !authenticatedUser) {
      return <Navigate to={paths.admin.login.getHref(orgSlug)} replace />;
    }

    if (requiredRoles && !requiredRoles.includes(authenticatedUser.role)) {
      return <Navigate to={getAdminHomeHref(authenticatedUser.role, orgSlug)} replace />;
    }
  }

  return <Outlet />;
}
