import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { paths } from "../config/paths";
import { useAppSelector } from "../lib/stores/hooks";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredAuth?: "admin" | "visitor" | "visitor-verified";
}

export function ProtectedRoute({ children, requiredAuth = "admin" }: ProtectedRouteProps) {
  const adminAuth = useAppSelector((state) => state.adminAuth);

  if (requiredAuth === "admin") {
    if (!adminAuth.isAuthenticated || !adminAuth.token) {
      return <Navigate to={paths.admin.login.getHref()} replace />;
    }
  }

  if (requiredAuth === "visitor") {
    const visitorData = localStorage.getItem("visitorRegistration");
    if (!visitorData) {
      return <Navigate to={paths.home.getHref()} replace />;
    }
  }

  if (requiredAuth === "visitor-verified") {
    const hasVerifiedIdentity = localStorage.getItem("visitorVerified");
    if (!hasVerifiedIdentity) {
      return <Navigate to={paths.verify.getHref()} replace />;
    }
  }

  return children;
}
