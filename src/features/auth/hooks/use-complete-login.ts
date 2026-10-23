import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { useAppDispatch } from "@/lib/stores/hooks";
import { adminApi } from "@/lib/api/admin/admin-api";
import { settingsApi } from "@/features/settings/api/settings-api-slice";
import { setAuthenticatedUser } from "../stores/admin-auth-slice";
import type { LoginResponse } from "../types/api-types";
import { normalizeUserRole } from "@/types/user-role";
import { getAdminHomeHref } from "../utils/get-admin-home-href";

export const useCompleteLogin = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const completeLogin = ({ user }: LoginResponse) => {
    if (!user?.orgSlug) {
      message.error(
        "Login succeeded but organization information is missing.",
      );
      return;
    }

    const authenticatedUser = { ...user, role: normalizeUserRole(user.role) };
    dispatch(adminApi.util.resetApiState());
    dispatch(setAuthenticatedUser(authenticatedUser));
    dispatch(settingsApi.util.upsertQueryData("getProfile", undefined, authenticatedUser));

    navigate(getAdminHomeHref(authenticatedUser.role, authenticatedUser.orgSlug), {
      replace: true,
    });
  };

  return completeLogin;
};