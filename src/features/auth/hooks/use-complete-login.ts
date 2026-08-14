import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { useAppDispatch } from "../../../lib/stores/hooks";
import { setAdminToken } from "../stores/admin-auth-slice";
import { paths } from "../../../config/paths";
import { api } from "@/lib/api/base";
import type { LoginResponse } from "../types/api-types";

export const useCompleteLogin = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const completeLogin = ({ accessToken, user }: LoginResponse) => {
    if (!accessToken) {
      message.error("Login succeeded but no token was returned.");
      return;
    }

    dispatch(setAdminToken(accessToken));

    // clears any cached data from a previous user/session
    dispatch(api.util.resetApiState());

    navigate(paths.admin.dashboard.getHref(user.orgSlug), {
      replace: true,
    });
  };

  return completeLogin;
};