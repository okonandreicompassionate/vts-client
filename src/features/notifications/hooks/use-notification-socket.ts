import { useEffect } from "react";
import { message } from "antd";

import { useAppDispatch } from "@/lib/stores/hooks";
import {settingsApi } from "../../settings/api/settings-api-slice";
import {
  connectNotificationSocket,
  disconnectNotificationSocket,
} from "../api/notification-socket";

type PendingVisitNotification = {
  recipientId: string;
  actorId: string | null;
  visitId: string | null;
  orgId: string;
  type: string;
  actionType: string;
  title: string;
  message: string;
  metadata: {
    notificationType: string;
    timestamp: string;
    recipientId: string;
    recipientRole?: string;
    actorId?: string;
    actorRole?: string;
    visitId: string;
    referenceId: string;
    hostName: string;
    visitorName?: string;
    department?: string | null;
    reason?: string;
  };
};

type UseNotificationSocketOptions = {
  token?: string;
  onPendingVisit?: (notification: PendingVisitNotification) => void;
};

export function useNotificationSocket({
  token,
  onPendingVisit,
}: UseNotificationSocketOptions = {}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!token) {
      disconnectNotificationSocket();
      return;
    }

    const socket = connectNotificationSocket(token);

    const handlePendingVisit = (
      notification: PendingVisitNotification,
    ) => {
      dispatch(settingsApi.util.invalidateTags(["Visits"]));

      message.success({
        content: notification.message || "New visit registered",
      });

      onPendingVisit?.(notification);
    };

    socket.on("visit.pending", handlePendingVisit);

    return () => {
      socket.off("visit.pending", handlePendingVisit);
    };
  }, [token, onPendingVisit, dispatch]);
}