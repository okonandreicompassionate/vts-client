// Visit API shapes used by both the staff visit pages and the public visitor portal.

export interface HostItem {
  id?: string;
  fullName?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

export interface CreateVisitResponse {
  id: string;
  orgId: string;
  visitorId: string;
  visitorName: string;
  hostName: string;
  purposeOfVisit: string;
  status: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  reviewedAt: string | null;
  referenceId: string;
  createdAt: string;
  updatedAt: string;

  visitor: {
    fullName: string;
    email: string;
    phoneNumber: string;
  };

  visitorSocketToken: string;
}

export interface VisitResponse {
  id: string;
  visitorId: string;
  referenceId: string;
  name?: string;
  fullName?: string;
  createdAt: string;
  email: string;
  phone: string;
  phoneNumber?: string;
  hostName: string;
  purpose: string;
  status: "PENDING" | "SIGNED_IN" | "REJECTED" | "SIGNED_OFF" | "APPROVED";
  checkInTime: string | null;
  checkOutTime: string | null;
  registeredAt: string;
  reviewedAt: string | null;
}
