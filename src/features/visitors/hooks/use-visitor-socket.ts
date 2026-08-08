import { useEffect } from "react";
import {
  connectVisitorSocket,
  disconnectVisitorSocket,
} from "../api/visitor-socket";
import { useDispatch } from "react-redux";
import { visitsApi } from "../api/visit-api-slice";

interface UseVisitorSocketOptions {
  visitorId?: string;
  token?: string;
  onStatusChanged?: (data: {
    visitId: string;
    status: string;
  }) => void;
}

export function useVisitorSocket({
  visitorId,
  token,
  onStatusChanged,
}: UseVisitorSocketOptions) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!visitorId || !token) {
      return;
    }

    const socket = connectVisitorSocket(token);

    const handleConnect = () => {
      socket.emit("visitor.join", visitorId);
    };

    const handleStatusChanged = (data: {
      visitId: string;
      status: string;
    }) => {
      // Optional component-level callback
      onStatusChanged?.(data);

      // Tell RTK Query that this specific visit has changed
      dispatch(
        visitsApi.util.invalidateTags([
          {
            type: "Visits",
            id: data.visitId,
          },
        ]),
      );
    };

    socket.on("connect", handleConnect);
    socket.on("visit.status.changed", handleStatusChanged);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("visit.status.changed", handleStatusChanged);

      disconnectVisitorSocket();
    };
  }, [visitorId, token, onStatusChanged, dispatch]);
}