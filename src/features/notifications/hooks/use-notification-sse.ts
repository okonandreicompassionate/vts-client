import { useEffect } from "react";
import { createNotificationSse } from "../api/sse/notification-sse";
import { useAppDispatch } from "@/lib/stores/hooks";
import { notificationsApi } from "../api/notifications-api-slice";

import { useOrganization } from "@/features/organizations";

export function useNotificationSse() {
  const dispatch = useAppDispatch();
  const { orgSlug } = useOrganization();

  useEffect(() => {
    if (!orgSlug) {
      return;
    }

    const eventSource = createNotificationSse(
      orgSlug,
      (event) => {
        switch (event.type) {
          case "connected":
            
            break;

          case "visit.pending":
            
            dispatch(notificationsApi.util.invalidateTags(["Visits"]));
            break;

          default:
            console.warn(`Unknown notification SSE event: ${event.type}`);
        }
      },
      (error) => {
        console.error("Notification SSE error:", error);
      },
    );

    return () => {
      eventSource.close();
    };
  }, [orgSlug, dispatch]);
}
