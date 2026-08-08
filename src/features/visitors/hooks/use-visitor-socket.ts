import { useEffect } from "react";
import { useDispatch } from "react-redux";

import {
  connectVisitorSocket,
  disconnectVisitorSocket,
} from "../api/visitor-socket";

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
      socket.emit("visitor.join");
    };

    const handleStatusChanged = (data: {
      visitId: string;
      status: string;
    }) => {
      onStatusChanged?.(data);

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
    socket.on(
      "visit.status.changed",
      handleStatusChanged,
    );

    return () => {
      socket.off("connect", handleConnect);
      socket.off(
        "visit.status.changed",
        handleStatusChanged,
      );

      disconnectVisitorSocket();
    };
  }, [
    visitorId,
    token,
    onStatusChanged,
    dispatch,
  ]);
}