import type { ReactNode } from "react";

export type Status = "pending" | "approved" | "rejected";

export interface StatusMeta {
  title: string;
  description: string;
  badgeColor: string;
  iconWrapBg: string;
  desktopIcon: ReactNode;
  actionLabel?: string;
  secondaryLabel?: string;
}