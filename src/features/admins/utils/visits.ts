import type { VisitRecord } from "../../../lib/api/types";
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

  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function toVisitorRow(visit: VisitRecord, index: number): VisitorRow {
  const id = visit.id ?? `${visit.email ?? "visit"}-${index}`;
  const status = toVisitorStatus(visit.status);

  return {
    id,
    name: visit.fullName ?? visit.name ?? "Unknown visitor",
    email: visit.email ?? "N/A",
    phone: visit.phoneNumber ?? visit.phone ?? "N/A",
    host: visit.hostName ?? visit.host ?? "Unassigned",
    purpose: visit.purposeOfVisit ?? visit.purpose ?? "N/A",
    status,
    time: formatVisitTime(visit.checkInTime ?? visit.time ?? visit.createdAt),
    checkIn:
      visit.checkIn ??
      visit.checkInTime ??
      (status === "Pending" || status === "Rejected" ? status : formatVisitTime(visit.updatedAt)),
    checkOut: visit.checkOut ?? visit.checkOutTime ?? "Pending",
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
