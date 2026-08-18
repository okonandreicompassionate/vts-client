import type { UserStatus } from "../types/types";

interface StatusPillProps {
  status: UserStatus;
}

const styles: Record<UserStatus, string> = {
  active:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",

  disabled:
    "bg-slate-100 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400",

  invited:
    "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
};

const labels: Record<UserStatus, string> = {
  active: "Active",
  disabled: "Disabled",
  invited: "Invited",
};

export default function StatusPill({ status }: StatusPillProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border-0 px-2 py-0.5 text-[11px] font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}