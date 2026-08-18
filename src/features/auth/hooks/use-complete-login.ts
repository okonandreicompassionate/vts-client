import { useNavigate } from "react-router-dom";
import { message } from "antd";

import { useAppDispatch } from "../../../lib/stores/hooks";
import { paths } from "../../../config/paths";
import { adminApi } from "@/lib/api/admin/admin-api";
import type { LoginResponse } from "../types/api-types";

export const useCompleteLogin = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const completeLogin = ({ user }: LoginResponse) => {
    if (!user?.orgSlug) {
      message.error("Login succeeded but organization information is missing.");
      return;
    }

    // Clear cached data from a previous user/session.
    dispatch(adminApi.util.resetApiState());

    navigate(paths.admin.dashboard.getHref(user.orgSlug), {
      replace: true,
    });
  };

  return completeLogin;
};