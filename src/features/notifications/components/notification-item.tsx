import { AlertTriangle, CheckCircle2, Info, UserRoundCheck } from "lucide-react";

import type { AppNotification, NotificationActionType } from "../types/notifications-api.types";

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

  return (
    <button
      type="button"
      onClick={() => onOpen(notification)}
      className={`flex w-full cursor-pointer gap-3 px-4 py-3 text-left transition hover:bg-slate-50 dark:hover:bg-zinc-800 ${
        notification.read ? "" : "bg-emerald-50/40 dark:bg-emerald-400/5"
      }`}
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${tone.className}`}
      >
        <Icon size={15} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-2">
          <span className="text-xs font-semibold text-slate-900 dark:text-zinc-100">
            {notification.title}
          </span>
          {!notification.read && (
            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-500" aria-label="Unread" />
          )}
        </span>
        <span className="mt-0.5 block text-xs text-slate-600 dark:text-zinc-300">
          {notification.message}
        </span>
        <span className="mt-1 block text-[11px] text-slate-400 dark:text-zinc-500">
          {timeAgo(notification.createdAt)}
        </span>
      </span>
    </button>
  );
}
