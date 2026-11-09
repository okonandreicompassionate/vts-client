import type { HostDecision } from "../types/api-types";

const tags: Record<HostDecision, { label: string; className: string }> = {
  PENDING: { label: "Awaiting host", className: "text-amber-500 dark:text-amber-300" },
  APPROVED: { label: "Host approved", className: "text-emerald-600 dark:text-emerald-300" },
  REJECTED: { label: "Host declined", className: "text-rose-500 dark:text-rose-300" },
};

/** The host's answer on a visit still under review. Nothing once a reviewer has decided. */
export default function HostDecisionTag({
  decision,
  status,
}: {
  decision: HostDecision | null;
  status: string;
}) {
  if (!decision || status !== "Pending") return null;

  const tag = tags[decision];

  return (
    <span className={`block text-[10px] font-medium whitespace-nowrap ${tag.className}`}>
      {tag.label}
    </span>
  );
}
