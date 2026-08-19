import { io, type Socket } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL;

type VisitorSocket = Socket;

let socket: VisitorSocket | null = null;

export function connectVisitorSocket(): VisitorSocket {
  if (socket?.connected) {
    return socket;
  }

  socket = io(`${API_URL}/visits`, {
    transports: ["polling", "websocket"],
    withCredentials: true,
    reconnection: false,
  });

  return socket;
}

export function disconnectVisitorSocket(): void {
  if (!socket) {
    return;
  }

  socket.disconnect();
  socket = null;
}