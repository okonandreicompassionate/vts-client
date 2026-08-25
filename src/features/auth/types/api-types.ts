

export interface LoginPayload {
  email: string;
  password: string;
}

export interface MicrosoftLoginPayload {
  accessToken: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: "SUPERADMIN" | "ADMIN";
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

export interface RefreshResponse {
  success: boolean;
}

export interface JoinOrganizationWithPasswordPayload {
  fullName: string;
  phoneNumber: string;
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
    role: "SUPERADMIN" | "ADMIN";
    orgId: string;
    orgSlug: string;
  };
}

export interface VisitorMeResponse {
  visitorId: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  orgId: string;
  orgSlug: string;
}

