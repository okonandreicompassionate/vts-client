export interface AvailableAppointment {
  id: string;
  referenceId: string;
  firstName: string;
  lastName: string;
  contactPhone: string | null;
  contactEmail: string | null;
  purpose: string;
  hostId: string | null;
  hostName: string | null;
  scheduledAt: string | null;
  status: "PENDING" | "APPROVED";
}

export interface VisitorEntry {
  email: string;
  visitor: { firstName: string; lastName: string; phone: string | null } | null;
  appointments: AvailableAppointment[];
}
