import { AlertTriangle, CheckCircle2, Info, UserRoundCheck } from "lucide-react";

import type { AppNotification, NotificationActionType } from "../types/notifications-api.types";
import NotificationCard from "./notification-card";

const tones: Record<NotificationActionType, { icon: typeof Info; className: string }> = {
  ACTION_REQUIRED: {
    icon: UserRoundCheck,
    className: "bg-amber-50 text-amber-500 dark:bg-amber-400/10 dark:text-amber-300",
  },
  SUCCESS: {
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300",
  },
  WARNING: {
    icon: AlertTriangle,
    className: "bg-rose-50 text-rose-500 dark:bg-rose-400/10 dark:text-rose-300",
  },
  INFO: {
    icon: Info,
    className: "bg-sky-50 text-sky-600 dark:bg-sky-400/10 dark:text-sky-300",
  },
};

const relativeTime = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
const notificationPresentations: Partial<
  Record<
    NotificationActionType,
    { eyebrow: string; accentClassName: string }
  >
> = {
  ACTION_REQUIRED: {
    eyebrow: "Action required",
    accentClassName: "from-amber-400 via-amber-500 to-orange-400",
  },
  SUCCESS: {
    eyebrow: "Visit update",
    accentClassName: "from-emerald-400 via-sky-500 to-blue-500",
  },
  WARNING: {
    eyebrow: "Attention",
    accentClassName: "from-rose-400 via-orange-400 to-amber-400",
  },
  INFO: {
    eyebrow: "GuestX update",
    accentClassName: "from-sky-400 via-sky-500 to-orange-400",
  },
};

function timeAgo(value: string) {
  const minutes = Math.round((new Date(value).getTime() - Date.now()) / 60_000);
  if (Math.abs(minutes) < 60) return relativeTime.format(minutes, "minute");
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return relativeTime.format(hours, "hour");
  return relativeTime.format(Math.round(hours / 24), "day");
}

export default function NotificationItem({
  notification,
  onOpen,
}: {
  notification: AppNotification;
  onOpen: (notification: AppNotification) => void;
}) {
  const tone = tones[notification.actionType];
  const Icon = tone.icon;
  const presentation = notificationPresentations[notification.actionType] ?? notificationPresentations.INFO!;
  const hasVisitDetails =
    notification.type !== "SYSTEM" &&
    Boolean(
      notification.metadata?.visitorName ||
        notification.metadata?.hostName ||
        notification.metadata?.referenceId,
    );

  if (hasVisitDetails) {
    const visitorName = notification.metadata?.visitorName;
    const hostName = notification.metadata?.hostName;
    const referenceId = notification.metadata?.referenceId;

    return (
      <button
        type="button"
        onClick={() => onOpen(notification)}
        className="w-full cursor-pointer p-2 text-left"
      >
        <NotificationCard
          icon={<Icon size={16} aria-hidden="true" />}
          eyebrow={presentation.eyebrow}
          title={notification.title || "Visitor checked in"}
          read={notification.read}
          toneClassName={tone.className}
          accentClassName={presentation.accentClassName}
        >
          <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-zinc-300">
            {notification.message}
          </p>
          {(visitorName || hostName || referenceId) && (
            <dl className="mt-3 divide-y divide-slate-200/80 overflow-hidden rounded-lg border border-slate-200/80 bg-white/80 text-xs dark:divide-zinc-700 dark:border-zinc-700 dark:bg-zinc-900/60">
              {visitorName && (
                <div className="grid grid-cols-[88px_1fr] gap-2 px-3 py-2">
                  <dt className="text-slate-500 dark:text-zinc-400">Visitor</dt>
                  <dd className="font-semibold text-slate-900 dark:text-zinc-100">{visitorName}</dd>
                </div>
              )}
              {hostName && (
                <div className="grid grid-cols-[88px_1fr] gap-2 px-3 py-2">
                  <dt className="text-slate-500 dark:text-zinc-400">Host</dt>
                  <dd className="font-semibold text-slate-900 dark:text-zinc-100">{hostName}</dd>
                </div>
              )}
              {referenceId && (
                <div className="grid grid-cols-[88px_1fr] gap-2 px-3 py-2">
                  <dt className="text-slate-500 dark:text-zinc-400">Reference</dt>
                  <dd className="font-semibold text-slate-900 dark:text-zinc-100">{referenceId}</dd>
                </div>
              )}
            </dl>
          )}
          <p className="mt-2 text-[10px] text-slate-400 dark:text-zinc-500">{timeAgo(notification.createdAt)}</p>
        </NotificationCard>
      </button>
    );
  }

  return (
    <button type="button" onClick={() => onOpen(notification)} className="w-full cursor-pointer p-2 text-left">
      <NotificationCard
        icon={<Icon size={16} aria-hidden="true" />}
        eyebrow={presentation.eyebrow}
        title={notification.title}
        read={notification.read}
        toneClassName={tone.className}
        accentClassName={presentation.accentClassName}
      >
        <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-zinc-300">
          {notification.message}
        </p>
        <p className="mt-2 text-[10px] text-slate-400 dark:text-zinc-500">{timeAgo(notification.createdAt)}</p>
      </NotificationCard>
    </button>
  );
}
