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
  pending: number;
  approved: number;
  rejected: number;
  /** Checked in (the client calls this "Signed In"). */
  signedIn: number;
  /** Checked out (the client calls this "Signed Off"). */
  signedOff: number;
}

/** GET /visits/stats as the server sends it. */
export interface ApiVisitStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  checkedIn: number;
  checkedOut: number;
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

export interface BookAppointmentPayload {
  idempotencyKey?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  purpose: string;
  date: string;
  time: string;
  /** Staff booking for someone else; HOST and FRONTDESK book for themselves. */
  hostId?: string;
}

export interface BulkVisitIds {
  visitIds: string[];
}

/** Advisory: a reviewer's approve/reject is final. null when no host decision is needed. */
export type HostDecision = "PENDING" | "APPROVED" | "REJECTED";
/** WALK_IN: the visitor's own request. STAFF_BOOKING: booked by staff. */
export type VisitSource = "WALK_IN" | "STAFF_BOOKING";

export interface VisitRecord {
  id?: string;
  hostId?: string | null;
  source?: VisitSource;
  hostDecision?: HostDecision | null;
  hostNote?: string | null;
  scheduledAt?: string | null;
  referenceId?: string;
  fullName?: string;
  name?: string;
  email?: string | null;
  phone?: string | null;
  phoneNumber?: string | null;
  hostName?: string | null;
  host?: string | null;
  purposeOfVisit?: string | null;
  purpose?: string | null;
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

/** A visit as listed on the dashboard. */
export interface DashboardVisit {
  id: string;
  referenceId: string;
  name: string;
  phone: string | null;
  hostName: string | null;
  purpose: string;
  status: string;
  scheduledAt: string | null;
  checkInTime: string | null;
  registeredAt: string;
}

export interface DashboardSummary {
  expected: number;
  onSite: number;
  overstayed: number;
  checkedOutToday: number;
  /** null when the caller can't review visits. */
  awaitingApproval: number | null;
  oldestPendingAt: string | null;
}

export interface DashboardTrends {
  days: number;
  checkInsByDay: { date: string; count: number }[];
  checkInsByHour: { hour: number; count: number }[];
  visitsByPurpose: { purpose: string; count: number }[];
  topHosts: { hostName: string; count: number }[];
}

export interface DashboardData {
  summary: DashboardSummary;
  arrivingToday: DashboardVisit[];
  onSite: (DashboardVisit & { overstayed: boolean })[];
  /** null when the caller can't review visits. */
  needsApproval: DashboardVisit[] | null;
  /** Admins only. */
  trends: DashboardTrends | null;
}

export interface DashboardParams {
  /** Local midnight today (ISO). */
  dayStart: string;
  timeZone: string;
}
