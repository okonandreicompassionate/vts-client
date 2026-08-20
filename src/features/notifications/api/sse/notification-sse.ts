import { paths } from "@/config/paths";

export type NotificationSseEvent = {
  type: string;
  data: unknown;
};

export function createNotificationSse(
  orgSlug: string,
  onEvent: (event: NotificationSseEvent) => void,
  onError?: (error: Event) => void,
): EventSource {
  const path = paths.notification.notificationStream.getHref(orgSlug);
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

  source.addEventListener("visit.pending", (event) => {
    const message = event as MessageEvent;

    onEvent({
      type: "visit.pending",
      data: JSON.parse(message.data),
    });
  });

  source.onerror = (error) => {
    onError?.(error);
  };

  return source;
}