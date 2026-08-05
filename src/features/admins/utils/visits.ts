import type { VisitRecord } from "../types/api-types";
import type { VisitorStatus } from "../components/StatusPill";

export interface VisitorRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  host: string;
  purpose: string;
  status: VisitorStatus;
  time: string;
  checkIn: string;
  checkOut: string;
  department: string;
}

export function toVisitorStatus(status?: string): VisitorStatus {
  const normalized = status?.toLowerCase().replace(/[_-]/g, " ").trim();

  if (normalized === "signed in" || normalized === "approved" || normalized === "sign in") {
    return "Signed In";
  }

  if (normalized === "signed off" || normalized === "signed out" || normalized === "completed") {
    return "Signed Off";
  }

  if (normalized === "rejected" || normalized === "declined") {
    return "Rejected";
  }

  return "Pending";
}

export function toApiVisitStatus(status: VisitorStatus) {
  if (status === "Signed In") return "SIGNED_IN";
  if (status === "Signed Off") return "SIGNED_OFF";
  if (status === "Rejected") return "REJECTED";
  return "PENDING";
}

export function formatVisitTime(value?: string) {
  if (!value) return "Pending";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const datePart = new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);

  const timePart = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);

  return `${datePart} • ${timePart}`;
}

export function toVisitorRow(visit: VisitRecord, index: number): VisitorRow {
  const visitTimestamp = visit.createdAt ?? visit.checkInTime ?? visit.time;
  const id =
    visit.id ??
    visit.referenceId ??
    (visit.email && visitTimestamp ? `${visit.email}-${visitTimestamp}` : visit.email) ??
    `visit-${index}`;
  const status = toVisitorStatus(visit.status);
  const fallbackCheckIn =
    status === "Pending" || status === "Rejected" ? undefined : visit.updatedAt;
  const resolvedCheckIn = visit.checkIn ?? visit.checkInTime ?? fallbackCheckIn;
  const resolvedCheckOut = visit.checkOut ?? visit.checkOutTime;

  return {
    id,
    name: visit.fullName ?? visit.name ?? "Unknown visitor",
    email: visit.email ?? "N/A",
    phone: visit.phoneNumber ?? visit.phone ?? "N/A",
    host: visit.hostName ?? visit.host ?? "Unassigned",
    purpose: visit.purposeOfVisit ?? visit.purpose ?? "N/A",
    status,
    time: formatVisitTime(visit.checkInTime ?? visit.time ?? visit.createdAt),
    checkIn: resolvedCheckIn ? formatVisitTime(resolvedCheckIn) : "Pending",
    checkOut: resolvedCheckOut ? formatVisitTime(resolvedCheckOut) : "Pending",
    department: visit.department ?? "N/A",
  };
}

export function getVisitorSummary(records: VisitorRow[]) {
  return {
    total: records.length,
    signedIn: records.filter((visitor) => visitor.status === "Signed In").length,
    signedOff: records.filter((visitor) => visitor.status === "Signed Off").length,
    pending: records.filter((visitor) => visitor.status === "Pending").length,
    rejected: records.filter((visitor) => visitor.status === "Rejected").length,
  };
}
