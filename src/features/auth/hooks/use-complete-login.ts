import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch } from "@/lib/stores/hooks";
import { adminApi } from "@/lib/api/admin/admin-api";
import { settingsApi } from "@/features/settings/api/settings-api-slice";
import { setAuthenticatedUser } from "../stores/admin-auth-slice";
import type { LoginResponse } from "../types/api-types";
import { normalizeUserRole } from "@/types/user-role";
import { getAdminHomeHref } from "../utils/get-admin-home-href";

// Only same-site paths, so a crafted login link can't send users elsewhere.
const isSafeRedirect = (path: string | null): path is string =>
  Boolean(path?.startsWith("/") && !path.startsWith("//"));

export const useCompleteLogin = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const completeLogin = ({ user }: LoginResponse) => {
    const authenticatedUser = { ...user, role: normalizeUserRole(user.role) };
    const redirectTo = searchParams.get("redirectTo");

    // Drop anything cached from a previous session or organization.
    dispatch(adminApi.util.resetApiState());
    dispatch(setAuthenticatedUser(authenticatedUser));
    dispatch(settingsApi.util.upsertQueryData("getProfile", undefined, authenticatedUser));

    navigate(isSafeRedirect(redirectTo) ? redirectTo : getAdminHomeHref(authenticatedUser.role), {
      replace: true,
    });
  };

  return completeLogin;
};
