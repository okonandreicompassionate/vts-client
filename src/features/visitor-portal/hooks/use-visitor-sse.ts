import { useEffect } from "react";

import { createVisitSse } from "../api/sse/visitor-sse";

interface VisitStatusChangedData {
  visitId: string;
  status: string;
}

interface UseVisitorSseOptions {
  onStatusChanged?: (data: VisitStatusChangedData) => void;
}

export function useVisitorSse({ onStatusChanged }: UseVisitorSseOptions = {}) {
  useEffect(() => {
    const eventSource = createVisitSse(
      (event) => {
        switch (event.type) {
          case "connected":
            break;

          case "visit.status.changed":
            onStatusChanged?.(event.data as VisitStatusChangedData);
            break;

          default:
            console.warn(`Unknown visit SSE event: ${event.type}`);
        }
      },
      (error) => {
        console.error("Visit SSE error:", error);
      },
    );

    return () => {
      eventSource.close();
    };
  }, [onStatusChanged]);
}
