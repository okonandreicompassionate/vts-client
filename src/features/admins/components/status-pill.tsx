export type VisitorStatus = "Signed In" | "Pending" | "Signed Off" | "Rejected";

const statusStyles: Record<VisitorStatus, string> = {
  "Signed In": "bg-emerald-50 text-emerald-500",
  Pending: "bg-orange-50 text-orange-400",
  "Signed Off": "bg-slate-100 text-slate-500",
  Rejected: "bg-rose-50 text-rose-500",
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