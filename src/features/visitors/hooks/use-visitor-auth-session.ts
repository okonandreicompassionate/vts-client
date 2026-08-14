import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useAppDispatch, useAppSelector } from "@/lib/stores/hooks";
import { clearVisitorAuth } from "../../auth/stores/visitor-auth-slice";

interface VisitorJwtPayload {
  exp?: number;
}

export function useVisitorAuthSession() {
  const dispatch = useAppDispatch();

  const token = useAppSelector((state) => state.visitorAuth.accessToken);

  useEffect(() => {
    if (!token) {
      return;
    }

    try {
      const decoded = jwtDecode<VisitorJwtPayload>(token);

      if (!decoded.exp) {
        return;
      }

      const expiresAt = decoded.exp * 1000;
      const remainingTime = expiresAt - Date.now();

      if (remainingTime <= 0) {
        dispatch(clearVisitorAuth());
        return;
      }

      const timeout = window.setTimeout(() => {
        dispatch(clearVisitorAuth());
      }, remainingTime);

      return () => {
        window.clearTimeout(timeout);
      };
    } catch {
      dispatch(clearVisitorAuth());
    }
  });
}
