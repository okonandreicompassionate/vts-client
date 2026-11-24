import type { ReactNode } from "react";

interface NotificationCardProps {
  children: ReactNode;
  icon: ReactNode;
  eyebrow: string;
  title: string;
  read: boolean;
  toneClassName: string;
  accentClassName?: string;
}

export default function NotificationCard({
  children,
  icon,
  eyebrow,
  title,
  read,
  toneClassName,
  accentClassName = "from-sky-400 via-sky-500 to-orange-400",
}: NotificationCardProps) {
  return (
    <article
      className={`relative overflow-hidden rounded-xl border px-3 py-3 transition ${
        read
          ? "border-slate-200/80 bg-white dark:border-zinc-700 dark:bg-zinc-900"
          : "border-sky-200/70 bg-sky-50/40 dark:border-sky-800/60 dark:bg-sky-950/20"
      }`}
    >
      <div className={`absolute inset-y-0 left-0 w-0.5 bg-gradient-to-b ${accentClassName}`} />
      <div className="flex gap-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${toneClassName}`}
        >
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[10px] font-bold tracking-[0.14em] text-sky-600 uppercase dark:text-sky-400">
                {eyebrow}
              </p>
              <h3 className="mt-0.5 text-sm font-bold text-slate-900 dark:text-zinc-100">{title}</h3>
            </div>
            {!read && (
              <span
                className="mt-1 h-2 w-2 shrink-0 rounded-full bg-sky-500 ring-4 ring-sky-100 dark:ring-sky-900"
                aria-label="Unread"
              />
            )}
          </div>
          {children}
        </div>
      </div>
    </article>
  );
}
