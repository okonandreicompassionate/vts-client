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
  pending: {
    subtitle: "Your request is now in review.",
    description: "",
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