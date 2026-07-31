export interface HealthResponse {
  status: string;
}

export const ORG_SLUG = "zoracom";

export interface VerifyIdentityPayload {
  orgSlug: string;
  email: string;
}

export interface CreateVisitPayload {
  orgSlug: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  hostName: string;
  department: string;
  purposeOfVisit: string;
}

export interface VisitRecord {
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
  time?: string;
  checkIn?: string;
  checkInTime?: string;
  checkOut?: string;
  checkOutTime?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface VisitListResponse {
  data?: VisitRecord[];
  visits?: VisitRecord[];
  total?: number;
  totalItems?: number;
  count?: number;
  page?: number;
  limit?: number;
  meta?: {
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

export interface VisitListParams {
  page: number;
  limit: number;
  status?: string;
  search?: string;
}

export interface VisitListResult {
  records: VisitRecord[];
  total: number;
  page: number;
  limit: number;
}

export interface AdminLoginPayload {
  orgSlug: string;
  email: string;
  password: string;
}

export interface MicrosoftLoginPayload {
  accessToken: string;
}

export interface AuthResponse {
  token?: string;
  accessToken?: string;
  data?: {
    token?: string;
    accessToken?: string;
    user?: UserProfile;
  };
  user?: UserProfile;
}

export interface UserProfile {
  id?: string;
  fullName?: string;
  name?: string;
  email?: string;
  role?: string;
  avatar?: string;
}
