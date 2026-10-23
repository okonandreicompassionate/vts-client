import { Navigate, Outlet } from "react-router-dom";

import { useGetProfileQuery } from "@/features/settings/api/settings-api-slice";
import { useOrganization } from "@/features/organizations";
import { useAppSelector } from "@/lib/stores/hooks";
import { getAdminHomeHref } from "@/features/auth/utils/get-admin-home-href";

export function AdminAuthRedirect() {
  const { orgSlug } = useOrganization();
  const sessionUser = useAppSelector((state) => state.adminAuth.user);
  const hasMatchingSession = sessionUser?.orgSlug === orgSlug;
  const { data: profile } = useGetProfileQuery(undefined, {
    skip: hasMatchingSession,
  });
  const user = hasMatchingSession ? sessionUser : profile;

  if (user) {
    return <Navigate to={getAdminHomeHref(user.role, user.orgSlug)} replace />;
  }

  return <Outlet />;
}
