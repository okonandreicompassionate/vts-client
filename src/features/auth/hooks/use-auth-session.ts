import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAppDispatch } from "@/lib/stores/hooks";
import { clearAuth } from "../stores/admin-auth-slice";
import { paths } from "@/config/paths";
import { useTenant } from "@/lib/tenant";
import { useGetProfileQuery } from "@/features/settings/api/settings-api-slice";

export function useAdminAuthSession() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { orgSlug } = useTenant();

  const {
    data: profile,
    isError,
    error,
    isLoading,
  } = useGetProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (profile) {
      return;
    }

    if (isError) {
      const status =
        typeof error === "object" &&
        error !== null &&
        "status" in error
          ? error.status
          : undefined;

      if (status === 401) {
        dispatch(clearAuth());

        navigate(
          paths.admin.login.getHref(orgSlug),
          { replace: true },
        );
      }
    }
  }, [
    profile,
    isError,
    error,
    isLoading,
    dispatch,
    navigate,
    orgSlug,
  ]);
}