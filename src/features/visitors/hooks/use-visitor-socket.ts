import { useEffect } from "react";
import { io, type Socket } from "socket.io-client";

type StatusChangedPayload = {
  visitId: string;
  status: string;
};

type UseVisitorSocketOptions = {
  token?: string;
  onStatusChanged?: (data: StatusChangedPayload) => void;
};

const SOCKET_URL = import.meta.env.VITE_API_URL;

export function useVisitorSocket({
  token,
  onStatusChanged,
}: UseVisitorSocketOptions = {}) {
  useEffect(() => {
    if (!token) {
      return;
    }

    const socket: Socket = io(`${SOCKET_URL}/visits`, {
      transports: ["polling", "websocket"],
      auth: {
        token,
      },
      withCredentials: true,
      reconnection: false,
    });

    const handleStatusChanged = (
      data: StatusChangedPayload,
    ) => {
      onStatusChanged?.(data);
    };

    socket.on(
      "visit.status.changed",
      handleStatusChanged,
    );

    socket.on("connect", () => {
      console.log(
        "Visitor WebSocket connected:",
        socket.id,
      );

      socket.emit("visitor.join");
    });

    socket.on("connect_error", (error) => {
      console.warn(
        "Visitor WebSocket connection failed:",
        error.message,
      );
    });

    socket.on("visitor.join.error", (error) => {
      console.warn(
        "Visitor WebSocket authentication failed:",
        error?.message ?? "Authentication failed.",
      );

      socket.disconnect();
    });

    socket.on("disconnect", (reason) => {
      console.warn(
        "Visitor WebSocket disconnected:",
        reason,
      );
    });

    return () => {
      socket.off(
        "visit.status.changed",
        handleStatusChanged,
      );

      socket.off("connect");
      socket.off("connect_error");
      socket.off("visitor.join.error");
      socket.off("disconnect");

      socket.disconnect();
    };
  }, [token, onStatusChanged]);
}