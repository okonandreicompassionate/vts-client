import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { useAppDispatch, useAppSelector } from "@/lib/stores/hooks";
import { clearAuth } from "../stores/admin-auth-slice";
import { paths } from "@/config/paths";
import { useOrganization } from "@/features/organizations";
import { useGetProfileQuery } from "@/features/settings/api/settings-api-slice";

export function useAdminAuthSession() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { orgSlug } = useOrganization();
  const sessionUser = useAppSelector((state) => state.adminAuth.user);
  const hasMatchingSession = sessionUser?.orgSlug === orgSlug;

  const profileQuery = useGetProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    skip: hasMatchingSession,
  });

  const { data: profile, isError, error, isLoading } = profileQuery;

  useEffect(() => {
    if (hasMatchingSession || isLoading || profile) {
      return;
    }

    if (!isError) {
      return;
    }

    const status =
      typeof error === "object" && error !== null && "status" in error ? error.status : undefined;

    if (status !== 401) {
      return;
    }

    const errorData =
      typeof error === "object" && error !== null && "data" in error
        ? (error.data as { message?: string } | undefined)
        : undefined;

    dispatch(clearAuth());

    message.info(errorData?.message ?? "Your session has ended. Please log in again.");

    navigate(paths.admin.login.getHref(orgSlug), { replace: true });
  }, [hasMatchingSession, profile, isError, error, isLoading, dispatch, navigate, orgSlug]);

  return {
    ...profileQuery,
    data: profileQuery.data ?? (hasMatchingSession ? sessionUser : undefined),
  };
}
