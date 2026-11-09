import { CalendarDays, CheckCircle2, Clock3 } from "lucide-react";

import { VISIT_TIME_ZONE } from "@/utils/visit-time";
import type { AvailableAppointment } from "../types/visitor-entry";

interface AppointmentChoiceCardProps {
  appointment: AvailableAppointment;
  onSelect: () => void;
}

export function AppointmentChoiceCard({ appointment, onSelect }: AppointmentChoiceCardProps) {
  const scheduled = appointment.scheduledAt ? new Date(appointment.scheduledAt) : null;
  const approved = appointment.status === "APPROVED";
  const StatusIcon = approved ? CheckCircle2 : Clock3;
  const badgeClass =
    "inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] leading-4 whitespace-nowrap text-slate-600 dark:border-slate-700/60 dark:bg-slate-800/60 dark:text-slate-300";

  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-slate-300 bg-linear-to-br from-slate-50 to-white px-3.5 py-3 text-left shadow-sm transition-colors hover:border-sky-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:border-slate-600 dark:from-zinc-800/70 dark:to-zinc-900 dark:hover:border-sky-500"
    >
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-xs font-bold tracking-wide wrap-anywhere text-slate-900 dark:text-zinc-100">
        {appointment.referenceId}
        </span>
        <span className="text-[11px] leading-4 wrap-anywhere text-slate-600 dark:text-zinc-100">
        <span className="text-zinc-500 dark:text-zinc-400">Host:</span>  {appointment.firstName} {appointment.lastName}
          <span className="mx-1.5 text-slate-400" aria-hidden="true">
            ·
          </span>
       <span className="text-zinc-500 dark:text-zinc-400">Purpose:</span>   {appointment.purpose}
        </span>
        <span className="mt-0.5 flex flex-wrap items-center gap-1.5">
          <span className={badgeClass}>
            <CalendarDays size={12} aria-hidden="true" />
            {scheduled
              ? scheduled.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  timeZone: VISIT_TIME_ZONE,
                })
              : "No scheduled date"}
          </span>
          {scheduled && (
            <span className={badgeClass}>
              <Clock3 size={12} aria-hidden="true" />
              {scheduled.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                timeZone: VISIT_TIME_ZONE,
              })}
            </span>
          )}
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] leading-4 font-medium whitespace-nowrap ${
              approved
                ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-500/60 dark:bg-emerald-500/10 dark:text-emerald-400"
                : "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-500/70 dark:bg-amber-500/10 dark:text-amber-400"
            }`}
          >
            <StatusIcon size={12} aria-hidden="true" />
            {approved ? "Approved" : "Pending approval"}
          </span>
        </span>
      </span>
    </button>
  );
}
