import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/lib/stores/hooks";
import { clearAdminAuth } from "../stores/admin-auth-slice";
import { useTenant } from "@/lib/tenant";
import { paths } from "@/config/paths";

interface JwtPayload {
  exp?: number;
}

export function useAdminAuthSession() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { orgSlug } = useTenant();

  const token = useAppSelector(
    (state) => state.adminAuth.token,
  );

  useEffect(() => {
    if (!token) {
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);

      if (!decoded.exp) {
        return;
      }

      const expiresAt = decoded.exp * 1000;
      const remainingTime = expiresAt - Date.now();

      const logout = () => {
        dispatch(clearAdminAuth());

        navigate(
          paths.admin.login.getHref(orgSlug),
          { replace: true },
        );
      };

      if (remainingTime <= 0) {
        logout();
        return;
      }

      const timeout = window.setTimeout(
        logout,
        remainingTime,
      );

      return () => {
        window.clearTimeout(timeout);
      };
    } catch {
      dispatch(clearAdminAuth());

      navigate(
        paths.admin.login.getHref(orgSlug),
        { replace: true },
      );
    }
  }, [
    token,
    dispatch,
    navigate,
    orgSlug,
  ]);
}