import { Alert, Button } from "antd";
import { Navigate, Outlet } from "react-router-dom";

import { paths } from "../config/paths";
import { useOrganization } from "@/features/organizations";
import { Spinner } from "@/components/ui/spinner";
import type { UserRole } from "@/types/user-role";
import { useAppSelector } from "@/lib/stores/hooks";
import { getAdminHomeHref } from "@/features/auth/utils/get-admin-home-href";
import { useAdminAuthSession } from "@/features/auth/hooks/use-auth-session";

interface ProtectedRouteProps {
  requiredAuth?: "admin" | "visitor" | "visitor-verified";
  requiredRoles?: readonly UserRole[];
}

export function ProtectedRoute({ requiredAuth = "admin", requiredRoles }: ProtectedRouteProps) {
  const { orgSlug } = useOrganization();
  const { data: user, error, isError, isLoading, isFetching, refetch } =
    useAdminAuthSession(requiredAuth === "admin");
  const sessionUser = useAppSelector((state) => state.adminAuth.user);
  const hasMatchingSession = sessionUser?.orgSlug === orgSlug;

  if (requiredAuth === "admin") {
    if ((isLoading || isFetching) && !hasMatchingSession) {
      return <Spinner variant="screen" />;
    }

    const authenticatedUser = hasMatchingSession ? sessionUser : user;

    const status =
      error && typeof error === "object" && "status" in error ? error.status : undefined;

    if (isError && !hasMatchingSession && status === 401) {
      return <Navigate to={paths.admin.login.getHref(orgSlug)} replace />;
    }

    if (
      !hasMatchingSession &&
      (!authenticatedUser || isError || authenticatedUser.orgSlug !== orgSlug)
    ) {
      const errorData =
        error && typeof error === "object" && "data" in error
          ? error.data
          : undefined;
      const responseMessage =
        errorData && typeof errorData === "object" && "message" in errorData
          ? errorData.message
          : undefined;
      const description = Array.isArray(responseMessage)
        ? responseMessage.join(", ")
        : typeof responseMessage === "string"
          ? responseMessage
          : status === "TIMEOUT_ERROR"
            ? "The server took too long to respond. Check your connection and try again."
          : authenticatedUser && authenticatedUser.orgSlug !== orgSlug
            ? "The account profile belongs to a different organization."
        : status
            ? `The server returned ${status}.`
            : "The server did not return an account profile.";

      return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6">
          <Alert
            type="error"
            showIcon
            message="Unable to verify your session"
            description={description}
          />
          <Button type="primary" onClick={() => void refetch()} loading={isFetching}>
            Try again
          </Button>
        </main>
      );
    }

    if (!authenticatedUser) {
      return <Navigate to={paths.admin.login.getHref(orgSlug)} replace />;
    }

    if (requiredRoles && !requiredRoles.includes(authenticatedUser.role)) {
      return <Navigate to={getAdminHomeHref(authenticatedUser.role, orgSlug)} replace />;
    }
  }

  return <Outlet />;
}
