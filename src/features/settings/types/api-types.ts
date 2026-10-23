

import type { ApiUserRole, UserRole } from "@/types/user-role";

export interface UpdateProfilePayload {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
}

export interface UpdatePasswordPayload {
  currentPassword: string;
  newPassword?: string;
}

export interface UpdateSettingsPayload {
  slug?: string;
  name?: string;
  maxVisitorsPerDay?: number;
  visitorBadgePrefix?: string;
}

export interface SettingsResponse {
  slug: string;
  name: string;
  maxVisitorsPerDay: number;
  visitorBadgePrefix: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
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

export type ApiUserProfile = Omit<UserProfile, "role"> & {
  role: ApiUserRole;
};
