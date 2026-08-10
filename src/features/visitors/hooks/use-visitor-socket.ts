import { useEffect, useRef } from "react";
import { io, type Socket } from "socket.io-client";

type StatusChangedPayload = {
  visitId: string;
  status: string;
};

type UseVisitorSocketOptions = {
  token?: string;
  onStatusChanged?: (
    data: StatusChangedPayload,
  ) => void;
};

const SOCKET_URL = import.meta.env.VITE_API_URL;

export function useVisitorSocket({
  token,
  onStatusChanged,
}: UseVisitorSocketOptions = {}) {
  const onStatusChangedRef = useRef(onStatusChanged);

  useEffect(() => {
    onStatusChangedRef.current = onStatusChanged;
  }, [onStatusChanged]);

  useEffect(() => {
    if (!token) {
      return;
    }

    const socket: Socket = io(`${SOCKET_URL}/visits`, {
      auth: {
        token,
      },
      withCredentials: true,

      // Let Socket.IO manage the transport upgrade.
      transports: ["polling", "websocket"],
    });

    const handleStatusChanged = (
      data: StatusChangedPayload,
    ) => {
      onStatusChangedRef.current?.(data);
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

      socket.disconnect();
    };
  }, [token]);
}