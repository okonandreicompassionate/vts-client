import { Info } from "lucide-react";
import type { VisitorRegistration } from "../types/visitor-profile";

type Props = {
  registration: VisitorRegistration;
  requestId: string;
  status: string;
  reason: string;
};

const details = [
  { label: "Purpose of Visit", field: "purposeOfVisit" },
  { label: "Host", field: "hostName" },
  { label: "Phone Number", field: "phoneNo" },
] as const;

export default function VisitorDetailsCard({ registration, requestId, status, reason }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm sm:p-7 lg:p-8 dark:border-slate-700 dark:bg-slate-900 w-full">
      <div className="flex items-center gap-4 border-b border-slate-100 pb-6 dark:border-slate-700">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white">
          <span className="text-lg font-bold">{registration.name.charAt(0)}</span>
        </div>
        <div className="min-w-0">
          <p className="truncate text-lg font-bold text-slate-900 dark:text-slate-100">
            {registration.name}
          </p>
          <p className="mt-0.5 text-sm text-slate-400 dark:text-slate-400">Request {requestId}</p>
        </div>
      </div>
      {status === "rejected" && reason && (
        <div className="mt-6 flex items-start gap-3 rounded-xl bg-rose-50 p-4">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" strokeWidth={2} />
          <div>
            <p className="text-xs font-semibold tracking-wide text-rose-400 uppercase">
              Reason for refusal
            </p>
            <p className="mt-1 text-sm font-semibold text-rose-700">{reason}</p>
          </div>
        </div>
      )}

      <div className="mt-6 divide-y divide-slate-100 dark:divide-slate-700">
        {details.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
          >
            <span className="shrink-0 text-sm text-slate-500">{item.label}</span>
            <span className="truncate text-right text-sm font-semibold text-slate-900 dark:text-slate-100 wrap-break-word">
              {registration[item.field]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
