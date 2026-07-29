import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAppSelector } from "../lib/stores/hooks";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredAuth?: "admin" | "visitor";
}

export function ProtectedRoute({ children, requiredAuth = "admin" }: ProtectedRouteProps) {
  const adminAuth = useAppSelector((state) => state.adminAuth);
  // Admin protection
  if (requiredAuth === "admin") {
    if (!adminAuth.isAuthenticated || !adminAuth.token) {
      return <Navigate to="/admin/login" replace />;
    }
  }

  // Visitor protection (based on registration status)
  if (requiredAuth === "visitor") {
    const visitorData = localStorage.getItem("visitorRegistration");
    if (!visitorData) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}
