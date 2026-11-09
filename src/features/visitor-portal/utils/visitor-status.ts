import type { VisitorProfileStatus } from "../types/visitor-profile";

export function normalizeVisitorStatus(status?: string | null): VisitorProfileStatus {
  const value = status?.toLowerCase().replace(/[_-]/g, " ").trim();
  switch (value) {
    case "approved":
      return "approved";
    case "checked in":
    case "signed in":
      return "checked-in";
    case "checked out":
    case "signed off":
      return "checked-out";
    case "rejected":
    case "declined":
      return "rejected";
    case "cancelled":
      return "cancelled";
    case "rescheduled":
      return "rescheduled";
    case "expired":
      return "expired";
    default:
      return "pending";
  }
}
