

import type { ApiUserRole } from "@/types/user-role";

export interface LoginPayload {
  email: string;
  password: string;
  /** "Remember me". When false the session ends with the browser. */
  rememberMe?: boolean;
}

export interface MicrosoftLoginPayload {
  accessToken: string;
  /** "Remember me". When false the session ends with the browser. */
  rememberMe?: boolean;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: ApiUserRole;
  orgId?: string;
  orgSlug: string;

  organization?: {
    name: string;
    slug: string;
    visitorBadgePrefix?: string;
    maxVisitorsPerDay?: number;
  };

  avatar?: string;
}

export interface LoginResponse {
  user: UserProfile;
}

export interface OrganizationChoice {
  id: string;
  name: string;
  slug: string;
}

/** Returned instead of a session when the credentials match accounts in several organizations. */
export interface OrganizationSelectionRequired {
  requiresOrganizationSelection: true;
  selectionToken: string;
  organizations: OrganizationChoice[];
}

export type SignInResponse = LoginResponse | OrganizationSelectionRequired;

export interface SelectOrganizationPayload {
  selectionToken: string;
  orgId: string;
  /** "Remember me". When false the session ends with the browser. */
  rememberMe?: boolean;
}

export const requiresOrganizationSelection = (
  response: SignInResponse,
): response is OrganizationSelectionRequired =>
  "requiresOrganizationSelection" in response && response.requiresOrganizationSelection;

export interface RefreshResponse {
  success: boolean;
}

export interface JoinOrganizationWithPasswordPayload {
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  inviteToken: string;
}

export interface JoinOrganizationWithPasswordResponse {
  accessToken: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    role: ApiUserRole;
    orgId: string;
    orgSlug: string;
  };
}

