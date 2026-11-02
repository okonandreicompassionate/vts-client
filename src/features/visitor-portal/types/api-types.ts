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
  visitorId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  purpose: string;
  hostId: string;
}
