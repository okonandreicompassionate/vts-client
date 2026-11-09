/** Field names match the server's UpdateProfileDto. */
export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

export interface UpdatePasswordPayload {
  currentPassword: string;
  newPassword?: string;
}

export interface UpdateSettingsPayload {
  requireVisitorEmailVerification?: boolean;
  slug?: string;
  azureTenantId?: string;
  name?: string;
  maxVisitorsPerDay?: number;
  visitorBadgePrefix?: string;
}

export interface SettingsResponse {
  requireVisitorEmailVerification: boolean;
  slug: string;
  authMode: "PASSWORD" | "AZURE_AD";
  /** Microsoft Entra directory staff must sign in from (Microsoft sign-in orgs only). */
  azureTenantId: string | null;
  name: string;
  maxVisitorsPerDay: number;
  visitorBadgePrefix: string;
}
