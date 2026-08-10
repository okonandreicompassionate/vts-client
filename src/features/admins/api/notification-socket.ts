import { io, type Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL;

type NotificationSocket = Socket;

let socket: NotificationSocket | null = null;

export function connectNotificationSocket(
  token: string,
): NotificationSocket {
  if (socket) {
    return socket;
  }

  socket = io(`${SOCKET_URL}/notifications`, {
    auth: {
      token,
    },
    transports: ["websocket"],
    autoConnect: true,
    reconnection: true,
  });

  return socket;
}

export function disconnectNotificationSocket(): void {
  if (!socket) {
    return;
  }

  socket.disconnect();
  socket = null;
}