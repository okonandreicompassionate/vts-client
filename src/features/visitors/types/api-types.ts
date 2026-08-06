export interface VerifyIdentityPayload {
  email?: string;
  phoneNumber?: string;
}

export interface VerifyIdentityResponse {
  success?: boolean;
  message?: string;
  existingVisitor?: {
    fullName?: string;
    name?: string;
    email?: string;
    phone?: string;
    phoneNumber?: string;
  };
  fullName?: string;
  name?: string;
  email?: string;
  phone?: string;
  phoneNumber?: string;
}

export interface CreateVisitPayload {
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
