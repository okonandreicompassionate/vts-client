import type { VisitorStatus } from "../components/visit-status-pill";

export type FilterTab = "All" | VisitorStatus;

export const filterTabs: FilterTab[] = [
  "All",
  "Signed In",
  "Signed Off",
  "Pending",
  "Rejected",
];