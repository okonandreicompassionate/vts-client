import { io, type Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL;

type NotificationSocket = Socket;

let socket: NotificationSocket | null = null;

export function connectNotificationSocket(token: string): NotificationSocket {
  if (socket) {
    if (!socket.connected) {
      socket.auth = { token };
      socket.connect();
    }

    return socket;
  }

  socket = io(`${SOCKET_URL}/notifications`, {
    transports: ["websocket"],
    auth: {
      token,
    },
    withCredentials: true,
    reconnection: true,
  });

  return socket;
}

export function disconnectNotificationSocket(): void {
  if (!socket) {
    return;
  }

  socket.removeAllListeners();
  socket.disconnect();
  socket = null;
}