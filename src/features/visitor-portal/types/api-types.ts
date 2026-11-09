import type { CreateVisitResponse } from "@/types/visit-api";

export type PublicCreateVisitResponse = Pick<
  CreateVisitResponse,
  "id" | "orgId" | "visitorId" | "referenceId" | "status" | "createdAt"
> & { emailVerified: boolean };

export interface RequestVisitorCodePayload {
  email: string;
}

export interface VerifyVisitorCodePayload {
  email: string;
  code: string;
}

/** Returning visitors get a session; new visitors get proof of their email to register with. */
export interface VerifyIdentityResponse {
  exists: boolean;
  email: string;
  visitor: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
  } | null;
}

export interface CreateVisitPayload {
  appointmentId?: string;
  idempotencyKey: string;
  visitorId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  purpose: string;
  hostId?: string;
}
