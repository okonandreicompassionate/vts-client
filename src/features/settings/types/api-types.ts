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
  azureTenantId?: string;
  name?: string;
  maxVisitorsPerDay?: number;
  visitorBadgePrefix?: string;
}

export interface SettingsResponse {
  slug: string;
  authMode: "PASSWORD" | "AZURE_AD";
  /** Microsoft Entra directory staff must sign in from (Microsoft sign-in orgs only). */
  azureTenantId: string | null;
  name: string;
  maxVisitorsPerDay: number;
  visitorBadgePrefix: string;
}
