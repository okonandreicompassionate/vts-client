import type { VisitorProfileStatus } from "./visitor-profile";

export type StatusMeta = {
  subtitle: string;
  description: string;
  reason: string;
  label: string;
  pillClasses: string;
  actionLabel?: string;
};

export const statusMeta: Record<VisitorProfileStatus, StatusMeta> = {
  "checked-in": {
    subtitle: "You are checked in.",
    description: "Your visit is in progress. Please check out with reception when you leave.",
    reason: "",
    label: "On site",
    pillClasses: "border border-emerald-500 bg-transparent text-emerald-500",
  },
  "checked-out": {
    subtitle: "Your visit is complete.",
    description: "You have checked out. Thank you for visiting.",
    reason: "",
    label: "Checked out",
    pillClasses: "border border-slate-400 bg-transparent text-slate-500 dark:text-zinc-400",
  },
  cancelled: {
    subtitle: "This appointment was cancelled.",
    description: "This appointment is no longer active. You can request another visit.",
    reason: "",
    label: "Cancelled",
    pillClasses: "border border-slate-400 bg-transparent text-slate-500 dark:text-zinc-400",
    actionLabel: "Request another visit",
  },
  expired: {
    subtitle: "This visit request has expired.",
    description: "The day of this visit has passed. You can request a new visit.",
    reason: "",
    label: "Expired",
    pillClasses: "border border-slate-400 bg-transparent text-slate-500 dark:text-zinc-400",
    actionLabel: "Request another visit",
  },
  rescheduled: {
    subtitle: "This appointment was rescheduled.",
    description: "Select the replacement appointment from My appointments for its current details.",
    reason: "",
    label: "Rescheduled",
    pillClasses: "border border-slate-400 bg-transparent text-slate-500 dark:text-zinc-400",
  },
  pending: {
    subtitle: "Your request is now in review.",
    description:
      "Find your details below. You will be notified once your request has been reviewed.",
    reason: "",
    label: "Pending",
    pillClasses: "border border-[#F5A623] bg-transparent text-[#F5A623]",
  },

  approved: {
    subtitle: "You're good to go.",
    description:
      "Your visitor request has been approved. Please present this profile page at reception when you arrive.",
    reason: "",
    label: "Approved",
    pillClasses: "border border-emerald-500 bg-transparent text-emerald-500",
  },

  rejected: {
    subtitle: "Your request was not approved.",
    description:
      "The administrator did not approve this visit. You can resubmit your request with updated details or contact your host for clarification.",
    reason: "",
    label: "Declined",
    pillClasses: "border border-rose-500 bg-transparent text-rose-500",
    actionLabel: "Register Again",
  },
};
