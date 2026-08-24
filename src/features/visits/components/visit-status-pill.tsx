export type VisitorStatus = "Signed In" | "Pending" | "Signed Off" | "Rejected";

const statusStyles: Record<VisitorStatus, string> = {
  "Signed In": "bg-emerald-50 text-emerald-500 dark:bg-emerald-400/10 dark:text-emerald-300",
  Pending: "bg-orange-50 text-orange-400 dark:bg-orange-400/10 dark:text-orange-300",
  "Signed Off": "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300",
  Rejected: "bg-rose-50 text-rose-500 dark:bg-rose-400/10 dark:text-rose-300",
};

function StatusPill({ status }: { status: VisitorStatus }) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}

export default StatusPill;