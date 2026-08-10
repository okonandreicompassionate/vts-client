import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

import { paths } from "../config/paths";
import { useAppSelector } from "../lib/stores/hooks";
import { useTenant } from "../lib/tenant";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredAuth?: "admin" | "visitor" | "visitor-verified";
}

export function ProtectedRoute({
  children,
  requiredAuth = "admin",
}: ProtectedRouteProps) {
  const { orgSlug } = useTenant();

  const adminAuth = useAppSelector(
    (state) => state.adminAuth,
  );

  const visitorAuth = useAppSelector(
    (state) => state.visitorAuth,
  );

  if (requiredAuth === "admin") {
    if (!adminAuth.isAuthenticated) {
      return (
        <Navigate
          to={paths.admin.login.getHref(orgSlug)}
          replace
        />
      );
    }
  }

  if (requiredAuth === "visitor") {
    if (!visitorAuth.isAuthenticated) {
      return (
        <Navigate
          to={paths.verify.getHref(orgSlug)}
          replace
        />
      );
    }
  }

  if (requiredAuth === "visitor-verified") {
    if (!visitorAuth.isVerified) {
      return (
        <Navigate
          to={paths.verify.getHref(orgSlug)}
          replace
        />
      );
    }
  }

  return children;
}
