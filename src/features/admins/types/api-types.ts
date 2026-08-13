export interface VisitRecord {
  id?: string;
  referenceId?: string;
  fullName?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  hostName?: string;
  host?: string;
  department?: string;
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

export interface VisitStats {
  total: number;
  signedIn: number;
  signedOff: number;
  pending: number;
  rejected: number;
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
  email: string;
  password: string;
}

export interface MicrosoftLoginPayload {
  accessToken: string;
}

export interface UpdateProfilePayload {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
}

export interface UpdatePasswordPayload {
  currentPassword: string;
  newPassword?: string;
}

export interface UpdateSettingsPayload {
  slug?: string;
  name?: string;
  maxVisitorsPerDay?: number;
  visitorBadgePrefix?: string;
}

export interface SettingsResponse {
  slug: string;
  name: string;
  maxVisitorsPerDay: number;
  visitorBadgePrefix: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: "SUPERADMIN" | "ADMIN";
  orgId?: string;
  orgSlug: string;

  organization?: {
    name: string;
    slug: string;
    visitorBadgePrefix?: string;
    maxVisitorsPerDay?: number;
  };

  avatar?: string;
}

export interface LoginResponse {
  accessToken: string;
  user: UserProfile;
}

export interface NotificationSettingsResponse {
  notifyPendingVisitEmail: boolean;
  dailySummaryEmailReport: boolean;
}

export interface UpdateNotificationSettingsPayload {
  notifyPendingVisitEmail?: boolean;
  dailySummaryEmailReport?: boolean;
}