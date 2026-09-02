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

export interface AdminItem {
  id: string;
  orgId: string;
  role: AdminRole;
  fullName: string;
  email: string;
  phoneNumber: string;
  organization?: AdminOrganizationSummary;
  orgSlug?: string;
}

export type GetAdminsResponse = AdminItem[];

export type GetAdminByIdResponse = Omit<AdminItem, "organization"> & {
  orgSlug: string;
};

export interface BulkDeactivateAdminsPayload {
  ids: string[];
}

export interface BulkDeactivateAdminsResponse {
  count: number;
  deletedIds: string[];
}