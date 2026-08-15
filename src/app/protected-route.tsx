import { Navigate, Outlet } from "react-router-dom";
import { paths } from "../config/paths";
import { useAppSelector } from "../lib/stores/hooks";
import { useTenant } from "../lib/tenant";

interface ProtectedRouteProps {
  requiredAuth?: "admin" | "visitor" | "visitor-verified";
}

export function ProtectedRoute({
  requiredAuth = "admin",
}: ProtectedRouteProps) {
  const { orgSlug } = useTenant();

  const adminAuth = useAppSelector((state) => state.adminAuth);
  const visitorAuth = useAppSelector((state) => state.visitorAuth);

  if (requiredAuth === "admin" && !adminAuth.isAuthenticated) {
    return (
      <Navigate
        to={paths.admin.login.getHref(orgSlug)}
        replace
      />
    );
  }

  if (requiredAuth === "visitor" && !visitorAuth.isAuthenticated) {
    return (
      <Navigate
        to={paths.verify.getHref(orgSlug)}
        replace
      />
    );
  }

  if (requiredAuth === "visitor-verified" && !visitorAuth.isVerified) {
    return (
      <Navigate
        to={paths.verify.getHref(orgSlug)}
        replace
      />
    );
  }

  return <Outlet />;
}