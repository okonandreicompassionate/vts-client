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
  requestedDate?: string;
  requestedTime?: string;
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

export function getVisitActionErrorMessage(error: unknown, fallback: string): string {
  if (!error || typeof error !== "object") {
    return fallback;
  }

  const responseData = "data" in error ? error.data : undefined;
  const responseMessage =
    responseData && typeof responseData === "object" && "message" in responseData
      ? responseData.message
      : undefined;
  const message =
    typeof responseMessage === "string"
      ? responseMessage
      : Array.isArray(responseMessage)
        ? responseMessage.filter((item): item is string => typeof item === "string").join(", ")
      : "message" in error && typeof error.message === "string"
        ? error.message
        : undefined;
  const status = "status" in error ? error.status : undefined;

  if (message && (typeof status === "number" || typeof status === "string")) {
    return `Request failed (${status}): ${message}`;
  }

  return message ?? fallback;
}

export function isVisitAlreadyCheckedInError(error: unknown): boolean {
  if (!error || typeof error !== "object" || !("status" in error) || error.status !== 409) {
    return false;
  }

  const responseData = "data" in error ? error.data : undefined;
  if (!responseData || typeof responseData !== "object" || !("message" in responseData)) {
    return false;
  }

  const responseMessage = responseData.message;
  return (
    typeof responseMessage === "string" &&
    responseMessage.toLowerCase().includes("already checked in")
  );
}

export function toVisitorStatus(
  status?: string,
  checkInTime?: string | null,
  checkOutTime?: string | null,
): VisitorStatus {
  const normalized = status
    ?.toLowerCase()
    .replace(/[_-]/g, " ")
    .trim();

  if (
    normalized === "signed off" ||
    normalized === "signed out" ||
    normalized === "checked out" ||
    Boolean(checkOutTime) ||
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

  if (
    normalized === "signed in" ||
    normalized === "sign in" ||
    normalized === "check in" ||
    normalized === "checked in" ||
    Boolean(checkInTime)
  ) {
    return "Signed In";
  }

  if (normalized === "approved") {
    return "Approved";
  }

  return "Pending";
}

export function toApiVisitStatus(status: VisitorStatus) {
  if (status === "Approved") return "APPROVED";
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

function formatAppointmentDate(value?: string | null) {
  if (!value) {
    return undefined;
  }

  const date = new Date(`${value.slice(0, 10)}T00:00:00`);

  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date);
}

function formatAppointmentTime(value?: string | null) {
  if (!value) {
    return undefined;
  }

  const match = /^(\d{1,2}):(\d{2})$/.exec(value);
  if (!match) {
    return value;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) {
    return value;
  }

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
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

  const status = toVisitorStatus(visit.status, checkInTime, checkOutTime);

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
      visit.phone ??
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
    requestedDate: formatAppointmentDate(visit.date),
    requestedTime: formatAppointmentTime(visit.time),

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