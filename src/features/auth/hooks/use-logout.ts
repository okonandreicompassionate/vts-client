import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { api } from "@/lib/api/base";
import { clearAuth } from "../stores/admin-auth-slice";
import { paths } from "@/config/paths";
import { useTenant } from "@/lib/tenant";

export function useLogout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orgSlug } = useTenant();

  return () => {
    dispatch(clearAuth());

    dispatch(api.util.resetApiState());

    localStorage.removeItem("visitorId");
    localStorage.removeItem("visitorVerified");
    localStorage.removeItem("visitorRegistration");

    navigate(paths.admin.login.getHref(orgSlug), {
      replace: true,
    });
  };
}