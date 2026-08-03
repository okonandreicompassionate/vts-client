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
  const adminAuth = useAppSelector((state) => state.adminAuth);

  if (requiredAuth === "admin") {
    if (!adminAuth.isAuthenticated || !adminAuth.token) {
      return (
        <Navigate
          to={paths.admin.login.getHref(orgSlug)}
          replace
        />
      );
    }
  }

  if (requiredAuth === "visitor") {
    const visitorData = localStorage.getItem("visitorRegistration");

    if (!visitorData) {
      return (
        <Navigate
          to={paths.home.getHref(orgSlug)}
          replace
        />
      );
    }
  }

  if (requiredAuth === "visitor-verified") {
    const hasVerifiedIdentity = localStorage.getItem("visitorVerified");

    if (!hasVerifiedIdentity) {
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
