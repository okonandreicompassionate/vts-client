export interface VerifyIdentityPayload {
  email: string;
}

export interface CreateVisitPayload {
  fullName: string;
  email: string;
  phoneNumber: string;
  hostName: string;
  department: string;
  purposeOfVisit: string;
}
