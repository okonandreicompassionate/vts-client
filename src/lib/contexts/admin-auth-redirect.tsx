import { Navigate, Outlet } from "react-router-dom";

import { useGetProfileQuery } from "@/features/settings/api/settings-api-slice";
import { useAppSelector } from "@/lib/stores/hooks";
import { getAdminHomeHref } from "@/features/auth/utils/get-admin-home-href";

export function AdminAuthRedirect() {
  const sessionUser = useAppSelector((state) => state.adminAuth.user);
  const { data: profile } = useGetProfileQuery(undefined, {
    skip: Boolean(sessionUser),
  });
  const user = sessionUser ?? profile;

  if (user) {
    return <Navigate to={getAdminHomeHref(user.role)} replace />;
  }

  return <Outlet />;
}
