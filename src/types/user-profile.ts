import type { ApiUserRole, UserRole } from "@/types/user-role";

/** The signed-in staff member, as the app uses it. */
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

/** Profile as the server returns it, before normalizeProfile. */
export type ApiUserProfile = Omit<
  UserProfile,
  "role" | "fullName" | "phoneNumber" | "orgSlug"
> & {
  role?: ApiUserRole;
  userRole?: ApiUserRole;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  phone?: string;
  orgSlug?: string;
};
