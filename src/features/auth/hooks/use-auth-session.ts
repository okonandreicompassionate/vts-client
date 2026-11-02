import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { useAppDispatch, useAppSelector } from "@/lib/stores/hooks";
import { clearAuth, setAuthenticatedUser } from "../stores/admin-auth-slice";
import { paths } from "@/config/paths";
import { useGetProfileQuery } from "@/features/settings/api/settings-api-slice";

export function useAdminAuthSession(enabled = true) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const sessionUser = useAppSelector((state) => state.adminAuth.user);
  const hasSession = Boolean(sessionUser);

  const profileQuery = useGetProfileQuery(undefined, {
    skip: !enabled || hasSession,
  });

  const { data: profile, isError, error, isLoading } = profileQuery;

  useEffect(() => {
    if (enabled && !hasSession && profile) {
      dispatch(setAuthenticatedUser(profile));
      return;
    }

    if (hasSession || isLoading || profile) {
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

    navigate(paths.admin.login.getHref(), { replace: true });
  }, [enabled, hasSession, profile, isError, error, isLoading, dispatch, navigate]);

  return {
    ...profileQuery,
    data: profileQuery.data ?? sessionUser ?? undefined,
  };
}
