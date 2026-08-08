import { io, type Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL;

type ServerToClientEvents = {
  "visit.status.changed": (data: {
    visitId: string;
    status: string;
  }) => void;

  "visitor.joined": (data: {
    room: string;
  }) => void;

  "visitor.join.error": (data: {
    message: string;
  }) => void;
};

type ClientToServerEvents = {
  "visitor.join": () => void;
};

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

export function connectVisitorSocket(
  token: string,
): Socket<ServerToClientEvents, ClientToServerEvents> {
  if (socket?.connected) {
    return socket;
  }

  socket = io(`${SOCKET_URL}/visits`, {
    auth: {
      token,
    },
    transports: ["websocket"],
    withCredentials: true,
  });

  return socket;
}

export function disconnectVisitorSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}