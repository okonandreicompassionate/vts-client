export interface VerifyIdentityPayload {
  email?: string;
  phoneNumber?: string;
}

export interface VerifyIdentityResponse {
  visitor: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
  };
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
  id?: string;
  referenceId?: string;
  status?: string;
  createdAt?: string;
  badgeNumber?: string;
  rejectionReason?: string;
  reason?: string;
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
