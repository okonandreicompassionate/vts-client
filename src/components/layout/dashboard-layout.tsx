import { Outlet } from "react-router-dom";
import { useState } from "react";

import DashboardHeader from "@/components/layout/dashboard-header";
import Sidebar from "@/components/layout/dashboard-sidebar";
import Footer from "@/components/layout/footer";
import { DashboardShellContext } from "./dashboard-shell-context";

import { useAdminAuthSession } from "@/features/auth/hooks/use-auth-session";
import { useStaffEvents } from "@/features/notifications/hooks/use-staff-events";

const COLLAPSED_KEY = "sidebar-collapsed";

// Storage can throw (private mode, blocked site data); the sidebar then just starts expanded.
const readCollapsed = () => {
  try {
    return localStorage.getItem(COLLAPSED_KEY) === "true";
  } catch {
    return false;
  }
};

const writeCollapsed = (value: boolean) => {
  try {
    localStorage.setItem(COLLAPSED_KEY, String(value));
  } catch {
    // Not remembered this time.
  }
};

/**
 * Staff shell: fixed sidebar, top bar and footer around one scrolling content pane.
 * The frame is clipped, not hidden: overflow-hidden boxes can still be scrolled by
 * scrollIntoView/focus, which dragged the sidebar along.
 */
const Layout = () => {
  const [collapsed, setCollapsedState] = useState(readCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);

  const setCollapsed = (value: boolean) => {
    setCollapsedState(value);
    writeCollapsed(value);
  };

  useAdminAuthSession();

  // One live stream per tab: notifications, visit lists, admins.
  useStaffEvents();

  return (
    <div className="fixed inset-0 flex min-h-0 min-w-0 overflow-clip bg-[#EEF2F7] dark:bg-zinc-900">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        setCollapsed={setCollapsed}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-clip">
        <DashboardShellContext.Provider value={{ setMobileOpen }}>
          <DashboardHeader />

          <main
            data-dashboard-scroll
            className="flex min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-auto overscroll-contain"
          >
            <Outlet />
          </main>

          <Footer className="shrink-0 border-t border-slate-100 dark:border-zinc-800" />
        </DashboardShellContext.Provider>
      </div>
    </div>
  );
};

export default Layout;
