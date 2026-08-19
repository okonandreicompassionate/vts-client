import { Outlet } from "react-router-dom";
import Sidebar from "@/app/routes/admin/layout/dashboard-sidebar";
import { useAdminAuthSession } from "@/features/auth/hooks/use-auth-session";
import { useNotificationSocket } from "../../../../features/notifications/hooks/use-notification-socket";
import Footer from "@/components/layout/footer";

const Layout = () => {
  useAdminAuthSession();


  useNotificationSocket();

  return (
    <div className="flex min-h-screen bg-[#EEF2F7] dark:bg-slate-900">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <main className="min-h-0 flex-1">
          <Outlet />
        </main>

        <div className="w-full bg-white ps-2 text-left dark:bg-slate-950/95 dark:text-white">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Layout;
