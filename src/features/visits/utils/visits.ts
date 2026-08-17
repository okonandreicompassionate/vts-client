import type { VisitRecord } from "../types/api-types";
import type { VisitorStatus } from "../components/visit-status-pill";

export interface VisitorRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  host: string;
  purpose: string;
  status: VisitorStatus;

  time: string;
  visitDate?: string;
  visitTime: string;

  registeredAt: string;
  reviewedAt: string | null;
  checkInTime: string | null;
  checkOutTime: string | null;

  checkIn: string;
  checkInDate?: string;
  checkOut: string;
}

export function toVisitorStatus(status?: string): VisitorStatus {
  const normalized = status
    ?.toLowerCase()
    .replace(/[_-]/g, " ")
    .trim();

  if (
    normalized === "signed in" ||
    normalized === "approved" ||
    normalized === "sign in"
  ) {
    return "Signed In";
  }

  if (
    normalized === "signed off" ||
    normalized === "signed out" ||
    normalized === "completed"
  ) {
    return "Signed Off";
  }

  if (
    normalized === "rejected" ||
    normalized === "declined"
  ) {
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

export function formatVisitTime(value?: string | null) {
  if (!value) {
    return "Pending";
  }

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

function formatVisitDateTime(value?: string | null) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return {
    date: new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date),

    time: new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date),
  };
}

export function toVisitorRow(
  visit: VisitRecord,
  index: number,
): VisitorRow {
  const registeredAt = visit.registeredAt ?? visit.createdAt ?? "";
  const reviewedAt = visit.reviewedAt ?? null;
  const checkInTime = visit.checkInTime ?? null;
  const checkOutTime = visit.checkOutTime ?? null;

  const id =
    visit.id ??
    visit.referenceId ??
    (visit.email && registeredAt
      ? `${visit.email}-${registeredAt}`
      : visit.email) ??
    `visit-${index}`;

  const status = toVisitorStatus(visit.status);

  const resolvedCheckIn =
    visit.checkIn ?? checkInTime;

  const resolvedCheckOut =
    visit.checkOut ?? checkOutTime;

  const visitDateTime = formatVisitDateTime(
    checkInTime ?? registeredAt,
  );

  const checkInDateTime =
    formatVisitDateTime(resolvedCheckIn);

  return {
    id,

    name:
      visit.fullName ??
      visit.name ??
      "Unknown visitor",

    email:
      visit.email ??
      "N/A",

    phone:
      visit.phoneNumber ??
      "N/A",

    host:
      visit.hostName ??
      visit.host ??
      "Unassigned",

    purpose:
      visit.purposeOfVisit ??
      visit.purpose ??
      "N/A",

    status,

    time: formatVisitTime(registeredAt),

    visitDate: visitDateTime?.date,

    visitTime: visitDateTime?.time ?? "Pending",

    registeredAt,

    reviewedAt,


    checkOutTime,

    checkIn: resolvedCheckIn
      ? formatVisitTime(resolvedCheckIn)
      : "Pending",

    checkInDate: checkInDateTime?.date,

    checkInTime:
      checkInDateTime?.time ?? "Pending",

    checkOut: resolvedCheckOut
      ? formatVisitTime(resolvedCheckOut)
      : "Pending",

  };
}

export function getVisitorSummary(
  records: VisitorRow[],
) {
  return {
    total: records.length,

    signedIn: records.filter(
      (visitor) => visitor.status === "Signed In",
    ).length,

    signedOff: records.filter(
      (visitor) => visitor.status === "Signed Off",
    ).length,

    pending: records.filter(
      (visitor) => visitor.status === "Pending",
    ).length,

    rejected: records.filter(
      (visitor) => visitor.status === "Rejected",
    ).length,
  };
}