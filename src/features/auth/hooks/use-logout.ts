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

  return async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/${orgSlug}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Admin logout request failed:", error);
    } finally {
      // Clear only admin-side client state.
      dispatch(clearAuth());

      // Clear cached admin API data.
      dispatch(adminApi.util.resetApiState());

      // Do NOT clear visitor state/storage here.
      navigate(paths.admin.login.getHref(orgSlug), {
        replace: true,
      });
    }
  };
}
