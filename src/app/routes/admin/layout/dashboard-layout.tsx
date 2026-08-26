import { Outlet } from "react-router-dom";
import { useState } from "react";

import Sidebar from "@/app/routes/admin/layout/dashboard-sidebar";
import Footer from "@/components/layout/footer";
import { DashboardShellContext } from "./dashboard-shell-context";

import { useAdminAuthSession } from "@/features/auth/hooks/use-auth-session";
import { useNotificationSse } from "@/features/notifications/hooks/use-notification-sse";

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useAdminAuthSession();

  useNotificationSse();

  return (
    <div className="flex min-h-screen bg-[#EEF2F7] dark:bg-slate-900">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        setCollapsed={setCollapsed}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardShellContext.Provider value={{ setMobileOpen }}>
          <main className="min-h-0 flex-1">
            <Outlet />
          </main>
        </DashboardShellContext.Provider>

        <div className="w-full bg-white ps-2 text-left dark:bg-slate-950/95 dark:text-white">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Layout;
