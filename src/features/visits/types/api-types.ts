export interface VerifyIdentityPayload {
  email?: string;
  phoneNumber?: string;
}

export interface VisitListResponse {
  data?: VisitRecord[];
  visits?: VisitRecord[];
  total?: number;
  totalItems?: number;
  count?: number;
  page?: number;
  limit?: number;

  meta: {
    total?: number;
    totalItems?: number;
    count?: number;
    page?: number;
    limit?: number;
  };

  pagination?: {
    total?: number;
    totalItems?: number;
    count?: number;
    page?: number;
    limit?: number;
  };
}

export interface VisitStats {
  total: number;
  signedIn: number;
  signedOff: number;
  pending: number;
  rejected: number;
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
  purposeOfVisit: string;
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

export interface BulkVisitIds {
  visitIds: string[];
}

export interface VisitResponse {
  id: string;
  visitorId: string;
  referenceId: string;
  name?: string;
  fullName?: string;
  createdAt: string;
  email: string;
  phoneNumber: string;
  hostName: string;
  purpose: string;
  status: "PENDING" | "SIGNED_IN" | "REJECTED" | "SIGNED_OFF" | "APPROVED";
  checkInTime: string | null;
  checkOutTime: string | null;
  registeredAt: string;
  reviewedAt: string | null;
}

export interface VisitRecord {
  id?: string;
  referenceId?: string;
  fullName?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  hostName?: string;
  host?: string;
  purposeOfVisit?: string;
  purpose?: string;
  status?: string;
  time?: string;
  registeredAt?: string;
  reviewedAt?: string | null;
  checkIn?: string;
  checkInTime?: string | null;
  checkOut?: string;
  checkOutTime?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
