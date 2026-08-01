export interface VerifyIdentityPayload {
  orgSlug: string;
  email: string;
}

export interface CreateVisitPayload {
  orgSlug: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  hostName: string;
  department: string;
  purposeOfVisit: string;
}
