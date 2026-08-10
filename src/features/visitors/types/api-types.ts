export interface VerifyIdentityPayload {
  email?: string;
  phoneNumber?: string;
}

export interface VerifyIdentityResponse {
  exists: boolean;
  visitor: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
  } | null;
  accessToken: string | null;
}

export interface CreateVisitPayload {
  visitorId?: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  hostName: string;
  department: string;
  purposeOfVisit: string;
}

export interface CreateVisitResponse {
  id: string;
  orgId: string;
  visitorId: string;
  visitorName: string;
  hostName: string;
  department: string;
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
  id?: string;
  referenceId?: string;
  fullName?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  phone?: string;
  hostName?: string;
  host?: string;
  department?: string;
  purposeOfVisit?: string;
  purpose?: string;
  status?: string;
  createdAt?: string;
  badgeNumber?: string;
  rejectionReason?: string;
  reason?: string;
}
