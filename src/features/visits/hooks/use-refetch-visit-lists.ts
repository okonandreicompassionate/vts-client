import { useCallback } from "react";

import { useAppDispatch } from "@/lib/stores/hooks";
import { adminVisitsApi } from "../api/admins-visit-api-slice";

/** Refreshes every visit list and stat on screen after a visit changes. */
export function useRefetchVisitLists() {
  const dispatch = useAppDispatch();

  return useCallback(async () => {
    dispatch(adminVisitsApi.util.invalidateTags(["Visits"]));
  }, [dispatch]);
}
