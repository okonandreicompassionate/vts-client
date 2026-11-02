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

export interface VisitListItem {
  id: string;
  referenceId: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  hostName?: string | null;
  purpose?: string | null;
  checkInTime?: string | null;
  checkOutTime?: string | null;
  status: string;
  registeredAt: string;
}

export interface VisitListPage {
  data: VisitListItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface VisitListParams {
  page: number;
  limit: number;
  status?: string | null;
  search?: string | null;
}

export interface RequestVisitorCodePayload {
  email: string;
}

export interface VerifyVisitorCodePayload {
  email: string;
  code: string;
}

/** Returning visitors get a session; new visitors get proof of their email to register with. */
export interface VerifyIdentityResponse {
  exists: boolean;
  email: string;
  visitor: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
  } | null;
}

export interface CreateVisitPayload {
  visitorId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  purpose: string;
  hostId: string;
}

export interface BookAppointmentPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  purpose: string;
  date: string;
  time: string;
}

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

export interface VisitRecord {
  id?: string;
  referenceId?: string;
  fullName?: string;
  name?: string;
  email?: string;
  phone?: string;
  phoneNumber?: string;
  hostName?: string;
  host?: string;
  purposeOfVisit?: string;
  purpose?: string;
  date?: string;
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
