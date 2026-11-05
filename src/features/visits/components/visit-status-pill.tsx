export type VisitorStatus =
  | "Approved"
  | "Signed In"
  | "Pending"
  | "Signed Off"
  | "Rejected"
  | "Cancelled"
  /** Replaced by a visit at a new time; the new visit carries on. */
  | "Rescheduled";

const statusStyles: Record<VisitorStatus, string> = {
  Approved: "bg-sky-50 text-sky-600 dark:bg-sky-400/10 dark:text-sky-300",
  "Signed In": "bg-emerald-50 text-emerald-500 dark:bg-emerald-400/10 dark:text-emerald-300",
  Pending: "bg-orange-50 text-orange-400 dark:bg-orange-400/10 dark:text-orange-300",
  "Signed Off": "bg-slate-100 text-slate-500 dark:bg-zinc-700 dark:text-zinc-300",
  Rejected: "bg-rose-50 text-rose-500 dark:bg-rose-400/10 dark:text-rose-300",
  Cancelled: "bg-slate-100 text-slate-500 line-through dark:bg-zinc-700 dark:text-zinc-400",
  Rescheduled: "bg-violet-50 text-violet-500 dark:bg-violet-400/10 dark:text-violet-300",
};

function StatusPill({ status }: { status: VisitorStatus }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-medium ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}

export default StatusPill;