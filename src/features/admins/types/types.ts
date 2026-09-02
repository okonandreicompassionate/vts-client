import type { AdminRole } from "@/features/admins/types/api-types";

export type AdminStatus = "active" | "disabled" | "invited";

export interface InviteFormValues {
  email: string;
  role: AdminRole;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: AdminRole;
}