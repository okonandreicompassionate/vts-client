import { useEffect } from "react";
import { useAppDispatch } from "@/lib/stores/hooks";
import { useOrganization } from "@/features/organizations";
import { adminsApi } from "../api/admins-api-slice";

export function useAdminsSSE() {
  const dispatch = useAppDispatch();
  const { orgSlug } = useOrganization();

  useEffect(() => {
    if (!orgSlug) return;

    const eventSource = new EventSource(
      `${import.meta.env.VITE_API_URL}/${orgSlug}/users/events`,
      { withCredentials: true },
    );

    eventSource.addEventListener("admins.changed", () => {
      dispatch(adminsApi.util.invalidateTags([{ type: "Admins", id: "LIST" }]));
    });

    eventSource.onerror = () => {
      if (eventSource.readyState === EventSource.CLOSED) {
        console.error("Admins SSE connection closed unexpectedly.");
      }
    };

    return () => {
      eventSource.close();
    };
  }, [dispatch, orgSlug]);
}
