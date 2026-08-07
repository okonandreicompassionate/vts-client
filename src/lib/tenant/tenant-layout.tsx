import { useAuthSession } from "@/features/admins/hooks/use-auth-session";
import { Outlet } from "react-router-dom";

export function TenantLayout() {
  useAuthSession()
  return <Outlet />;
}