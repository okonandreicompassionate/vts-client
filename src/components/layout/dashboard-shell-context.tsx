import { createContext, useContext } from "react";

type DashboardShellContextValue = {
  setMobileOpen: (open: boolean) => void;
};

export const DashboardShellContext =
  createContext<DashboardShellContextValue | null>(null);

export function useDashboardShell() {
  return useContext(DashboardShellContext);
}
