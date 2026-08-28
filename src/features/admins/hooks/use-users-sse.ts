import { useEffect } from "react";
import { useAppDispatch } from "@/lib/stores/hooks";
import { useOrganization } from "@/features/organizations";
import { usersApi } from "../api/admins-api-slice";

export function useUsersSSE() {
  const dispatch = useAppDispatch();
  const { orgSlug } = useOrganization();

  useEffect(() => {
    if (!orgSlug) return;

    const eventSource = new EventSource(`${import.meta.env.VITE_API_URL}/${orgSlug}/users/events`, {
      withCredentials: true,
    });

    eventSource.addEventListener("users.changed", () => {
      dispatch(usersApi.util.invalidateTags([{ type: "Users", id: "LIST" }]));
    });

    eventSource.onerror = () => {
      if (eventSource.readyState === EventSource.CLOSED) {
        console.error("Users SSE connection closed unexpectedly.");
      }
    };

    return () => {
      eventSource.close();
    };
  }, [dispatch, orgSlug]);
}
