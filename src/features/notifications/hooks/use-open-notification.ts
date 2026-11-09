import { useNavigate } from "react-router-dom";

import { useAdminAuthSession } from "@/features/auth/hooks/use-auth-session";
import { useMarkNotificationReadMutation } from "../api/notifications-api-slice";
import type { AppNotification } from "../types/notifications-api.types";
import { notificationHref } from "../utils/notification-href";

/** Marks a notification read and goes to the page where it can be acted on. */
export function useOpenNotification() {
  const navigate = useNavigate();
  const { data: profile } = useAdminAuthSession();
  const [markRead] = useMarkNotificationReadMutation();

  return (notification: Pick<AppNotification, "id" | "type" | "read">) => {
    if (!notification.read) void markRead(notification.id);
    navigate(notificationHref(notification.type, profile?.role));
  };
}
