import { useEffect } from "react";
import { useAppDispatch } from "@/lib/stores/hooks";
import { useGetVisitorMeQuery } from "../api/visitor-vists-api";
import { clearVisitorAuth, setVisitorSession } from "@/features/auth/stores/visitor-auth-slice";

export function useVisitorAuthHydration() {
  const dispatch = useAppDispatch();

  const {
    data,
    isSuccess,
    isError,
    error,
  } = useGetVisitorMeQuery();

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(
        setVisitorSession({
          visitorId: data.visitorId,
        }),
      );

      return;
    }

    if (isError) {
      const status =
        typeof error === "object" &&
        error !== null &&
        "status" in error
          ? error.status
          : undefined;

      if (status === 401) {
        dispatch(clearVisitorAuth());
      }
    }
  }, [
    dispatch,
    data,
    isSuccess,
    isError,
    error,
  ]);
}