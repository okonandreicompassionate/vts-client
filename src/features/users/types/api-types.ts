export type AdminRole = "SUPERADMIN" | "ADMIN";

export interface InviteAdminPayload {
  email: string;
  role: AdminRole;
}

export interface InviteAdminResponse {
  id: string;
  organizationId: string;
  email: string;
  role: AdminRole;
  status: "PENDING";
  expiresAt: string;
  invitedById: string;
  token: string;
  createdAt: string;
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
    role: AdminRole;
    orgId: string;
    orgSlug: string;
  };
}

export interface AdminOrganizationSummary {
  slug: string;
}

export interface AdminUserItem {
  id: string;
  orgId: string;
  role: AdminRole;
  fullName: string;
  email: string;
  phoneNumber: string;
  organization?: AdminOrganizationSummary;
  orgSlug?: string;
}

export type GetAdminsResponse = AdminUserItem[];

export type GetAdminByIdResponse = Omit<AdminUserItem, "organization"> & {
  orgSlug: string;
};