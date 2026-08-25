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

export interface BulkDeleteAdminsPayload {
  ids: string[];
}

export interface BulkDeleteAdminsResponse {
  count: number;
  deletedIds: string[];
}