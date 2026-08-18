import { useNavigate } from "react-router-dom";
import { message } from "antd";

import { paths } from "@/config/paths";
import type { LoginResponse } from "../types/api-types";

export const useCompleteLogin = () => {
  const navigate = useNavigate();

  const completeLogin = ({ user }: LoginResponse) => {
    if (!user?.orgSlug) {
      message.error(
        "Login succeeded but organization information is missing.",
      );
      return;
    }

    navigate(
      paths.admin.dashboard.getHref(user.orgSlug),
      {
        replace: true,
      },
    );
  };

  return completeLogin;
};