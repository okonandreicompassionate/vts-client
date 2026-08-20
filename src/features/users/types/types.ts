import type { AdminRole } from "@/features/users/types/api-types";

export type UserStatus = "active" | "disabled" | "invited";

export interface InviteFormValues {
  email: string;
  role: AdminRole;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: AdminRole;
}