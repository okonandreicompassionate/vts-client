import { notification } from "antd";
import { useEffect, useEffectEvent } from "react";

import { api } from "@/lib/api/api";
import { useAppDispatch } from "@/lib/stores/hooks";
import { NOTIFICATION_INBOX_TAG } from "../api/notifications-api-slice";
import type { AppNotification } from "../types/notifications-api.types";
import { useOpenNotification } from "./use-open-notification";

const STREAM_URL = `${import.meta.env.VITE_API_URL}/notifications/stream`;

type StaffEvent =
  | "notification.created"
  | "notification.read"
  | "visits.changed"
  | "admins.changed";

const EVENTS: StaffEvent[] = [
  "notification.created",
  "notification.read",
  "visits.changed",
  "admins.changed",
];

const TOAST_TYPE = {
  ACTION_REQUIRED: "info",
  INFO: "info",
  SUCCESS: "success",
  WARNING: "warning",
} as const;

/**
 * The staff live stream, opened once by the dashboard layout. Keeps notifications,
 * visit lists and the admins list fresh, and pops up a toast for new notifications.
 * EventSource reconnects by itself; the server sends a ping to keep it open.
 */
export function useStaffEvents() {
  const dispatch = useAppDispatch();
  const openNotification = useOpenNotification();

  const onEvent = useEffectEvent((type: StaffEvent, raw: string) => {
    switch (type) {
      case "notification.created": {
        const created = JSON.parse(raw) as AppNotification;
        dispatch(api.util.invalidateTags([NOTIFICATION_INBOX_TAG]));
        notification.open({
          key: created.id,
          type: TOAST_TYPE[created.actionType],
          title: created.title,
          description: created.message,
          placement: "bottomRight",
          duration: 6,
          onClick: () => {
            notification.destroy(created.id);
            openNotification(created);
          },
          className: "cursor-pointer",
        });
        return;
      }
      case "notification.read":
        dispatch(api.util.invalidateTags([NOTIFICATION_INBOX_TAG]));
        return;
      case "visits.changed":
        dispatch(api.util.invalidateTags(["Visits"]));
        return;
      case "admins.changed":
        dispatch(api.util.invalidateTags([{ type: "Admins", id: "LIST" }]));
        return;
    }
  });

  // A subscription: opened on mount, closed on unmount.
  useEffect(() => {
    const source = new EventSource(STREAM_URL, { withCredentials: true });

    for (const type of EVENTS) {
      source.addEventListener(type, (event) => onEvent(type, (event as MessageEvent<string>).data));
    }

    return () => source.close();
  }, []);
}
