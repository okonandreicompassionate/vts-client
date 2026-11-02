export type VisitorProfileStatus = "pending" | "approved" | "rejected";

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
  badgeNumber?: string;
  reason?: string;
  visitorToken?: string;
};
