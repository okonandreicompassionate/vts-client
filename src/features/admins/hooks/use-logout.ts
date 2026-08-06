import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { api } from "@/lib/api/base";
import { clearAdminAuth } from "../stores/auth-slice";
import { paths } from "@/config/paths";
import { useTenant } from "@/lib/tenant";

export function useLogout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orgSlug } = useTenant();

  return () => {
    dispatch(clearAdminAuth());

    dispatch(api.util.resetApiState());

    localStorage.removeItem("visitorIdentity");
    localStorage.removeItem("visitorVerified");
    localStorage.removeItem("visitorRegistration");

    navigate(paths.admin.login.getHref(orgSlug), {
      replace: true,
    });
  };
}