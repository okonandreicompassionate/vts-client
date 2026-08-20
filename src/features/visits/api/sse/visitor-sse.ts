import { paths } from "@/config/paths";

export type VisitSseEvent = {
  type: string;
  data: unknown;
};

export function createVisitSse(
  orgSlug: string,
  onEvent: (event: VisitSseEvent) => void,
  onError?: (error: Event) => void,
): EventSource {
  const path = paths.notification.visitStream.getHref(orgSlug);
    const url = `${import.meta.env.VITE_API_URL}${path}`;

  const source = new EventSource(url, {
    withCredentials: true,
  });

  source.addEventListener("connected", (event) => {
    const message = event as MessageEvent;

    onEvent({
      type: "connected",
      data: JSON.parse(message.data),
    });
  });

  source.addEventListener("visit.status.changed", (event) => {
    const message = event as MessageEvent;

    onEvent({
      type: "visit.status.changed",
      data: JSON.parse(message.data),
    });
  });

  source.onerror = (error) => {
    onError?.(error);
  };

  return source;
}