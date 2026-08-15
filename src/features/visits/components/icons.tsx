import { CheckCircle2, XCircle } from "lucide-react";

export const PendingIcon = () => (
  <img src="/pending.svg" alt="Pending approval" className="h-16 w-16 object-contain" />
);

export const ApprovedIcon = () => (
  <CheckCircle2 className="h-16 w-16 text-emerald-500" />
);

export const RejectedIcon = () => (
  <XCircle className="h-16 w-16 text-rose-500" />
);
