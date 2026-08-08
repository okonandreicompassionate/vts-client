import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

import { paths } from "../config/paths";
import { useAppSelector } from "../lib/stores/hooks";
import { useTenant } from "../lib/tenant";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredAuth?: "admin" | "visitor" | "visitor-verified";
}

interface VisitorSession {
  visitorId: string;
  accessToken: string;
}

function getVisitorSession(): VisitorSession | null {
  const stored = localStorage.getItem("visitorSession");

  if (!stored) {
    return null;
  }

  try {
    const session = JSON.parse(stored) as Partial<VisitorSession>;

    if (!session.visitorId || !session.accessToken) {
      return null;
    }

    return {
      visitorId: session.visitorId,
      accessToken: session.accessToken,
    };
  } catch {
    localStorage.removeItem("visitorSession");
    return null;
  }
}

export function ProtectedRoute({
  children,
  requiredAuth = "admin",
}: ProtectedRouteProps) {
  const { orgSlug } = useTenant();
  const adminAuth = useAppSelector((state) => state.adminAuth);

  if (requiredAuth === "admin") {
    if (!adminAuth.token) {
      return (
        <Navigate
          to={paths.admin.login.getHref(orgSlug)}
          replace
        />
      );
    }
  }

  if (requiredAuth === "visitor") {
    const visitorSession = getVisitorSession();

    if (!visitorSession) {
      return (
        <Navigate
          to={paths.verify.getHref(orgSlug)}
          replace
        />
      );
    }
  }

  if (requiredAuth === "visitor-verified") {
    const visitorSession = getVisitorSession();

    if (!visitorSession) {
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