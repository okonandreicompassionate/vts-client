export type VisitorProfileStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "checked-in"
  | "checked-out"
  | "cancelled"
  | "rescheduled"
  | "expired";

export type VisitorRegistration = {
  id?: string;
  visitorId?: string;
  name: string;
  purposeOfVisit: string;
  hostName: string;
  phoneNo: string;
  email: string;
  status?: VisitorProfileStatus;
  requestId?: string;
  createdAt?: string;
  scheduledAt?: string | null;
  badgeNumber?: string;
  reason?: string;
  visitorToken?: string;
};
