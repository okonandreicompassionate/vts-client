import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { adminApi } from "@/lib/api/admin/admin-api";
import { clearAuth } from "../stores/admin-auth-slice";
import { paths } from "@/config/paths";
import { useTenant } from "@/lib/tenant";

export function useLogout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orgSlug } = useTenant();

  return () => {
    dispatch(clearAuth());

    dispatch(adminApi.util.resetApiState());

    localStorage.removeItem("visitorId");
    localStorage.removeItem("visitorVerified");
    localStorage.removeItem("visitorRegistration");

    navigate(paths.admin.login.getHref(orgSlug), {
      replace: true,
    });
  };
}