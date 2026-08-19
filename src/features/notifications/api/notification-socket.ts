import { io, type Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL;

type NotificationSocket = Socket;

let socket: NotificationSocket | null = null;

export function connectNotificationSocket(): NotificationSocket {
  console.log("[NotificationSocket] connectNotificationSocket() called");

  if (socket) {
    console.log(
      "[NotificationSocket] Existing socket:",
      socket.connected,
    );

    if (!socket.connected) {
      console.log("[NotificationSocket] Reconnecting...");
      socket.connect();
    }

    return socket;
  }

  console.log(
    "[NotificationSocket] Creating socket:",
    `${SOCKET_URL}/notifications`,
  );

  socket = io(`${SOCKET_URL}/notifications`, {
    transports: ["polling", "websocket"],
    withCredentials: true,
    reconnection: true,
  });

  socket.on("connect", () => {
    console.log(
      "[NotificationSocket] Connected:",
      socket?.id,
    );
  });

  socket.on("connect_error", (error) => {
    console.error(
      "[NotificationSocket] Connection error:",
      error.message,
      error,
    );
  });

  socket.on("disconnect", (reason) => {
    console.warn(
      "[NotificationSocket] Disconnected:",
      reason,
    );
  });

  return socket;
}

export function disconnectNotificationSocket(): void {
  console.log("[NotificationSocket] disconnectNotificationSocket()");

  if (!socket) {
    return;
  }

  socket.removeAllListeners();
  socket.disconnect();
  socket = null;
}