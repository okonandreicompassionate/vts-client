import { useEffect } from "react";
import { message } from "antd";
import { useAppDispatch } from "@/lib/stores/hooks";
import { authApi } from "../api/admin-api-slice";
import {
  connectNotificationSocket,
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
};

export function useNotificationSocket({
  token,
}: UseNotificationSocketOptions = {}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log(
      "Notification socket effect:",
      token ? "TOKEN EXISTS" : "NO TOKEN",
    );

    if (!token) {
      return;
    }

    const socket = connectNotificationSocket(token);

    const handleConnect = () => {
      console.log(
        "Admin notification WebSocket connected:",
        socket.id,
      );
    };

    const handlePendingVisit = (
      notification: PendingVisitNotification,
    ) => {
      console.log(
        "visit.pending RECEIVED:",
        notification.visitId,
        "socket:",
        socket.id,
      );

      dispatch(
        authApi.util.invalidateTags(["Visits"]),
      );

      message.success({
        content:
          notification.message ||
          "New visit registered",
      });
    };

    const handleConnectError = (error: Error) => {
      console.error(
        "Notification WebSocket connection failed:",
        error.message,
      );
    };

    const handleSocketError = (error: {
      message?: string;
    }) => {
      console.error(
        "Notification WebSocket error:",
        error?.message,
      );
    };

    const handleDisconnect = (
      reason: string,
    ) => {
      console.warn(
        "🔌 Notification WebSocket disconnected:",
        reason,
      );
    };

    socket.on("connect", handleConnect);
    socket.on(
      "visit.pending",
      handlePendingVisit,
    );
    socket.on(
      "connect_error",
      handleConnectError,
    );
    socket.on(
      "notification.socket.error",
      handleSocketError,
    );
    socket.on(
      "disconnect",
      handleDisconnect,
    );

    return () => {


      socket.off("connect", handleConnect);

      socket.off(
        "visit.pending",
        handlePendingVisit,
      );

      socket.off(
        "connect_error",
        handleConnectError,
      );

      socket.off(
        "notification.socket.error",
        handleSocketError,
      );

      socket.off(
        "disconnect",
        handleDisconnect,
      );


    };
  }, [token, dispatch]);
}