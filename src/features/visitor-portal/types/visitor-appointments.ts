import type { VisitResponse } from "@/types/visit-api";

export type VisitorVisit = Omit<VisitResponse, "status" | "phone"> & {
  orgSlug: string;
  status: string;
  phone: string | null;
  scheduledAt?: string | null;
};

export interface VisitorAppointment {
  id: string;
  referenceId: string;
  name: string;
  hostName: string | null;
  purpose: string;
  status: string;
  scheduledAt: string | null;
  checkInTime: string | null;
  registeredAt: string;
}

export interface VisitorAppointmentsResponse {
  orgSlug: string;
  data: VisitorAppointment[];
  restricted: boolean;
  meta: { page: number; limit: number; total: number; totalPages: number };
}
