import { Outlet } from "react-router-dom";
import Sidebar from "@/features/admins/components/layout/sidebar";
import { useAdminAuthSession } from "@/features/auth/hooks/use-auth-session";
import { useAppSelector } from "@/lib/stores/hooks";
import { useNotificationSocket } from "../../../notifications/hooks/use-notification-socket";
import Footer from "@/components/layout/footer";

const Layout = () => {
  useAdminAuthSession();

  const token = useAppSelector((state) => state.adminAuth.token);

  useNotificationSocket({
    token: token ?? undefined,
  });

  return (
    <div className="flex min-h-screen bg-[#EEF2F7] dark:bg-slate-900">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <main className="min-h-0 flex-1">
          <Outlet />
        </main>

        <Footer className="w-full bg-white text-left ps-2 fixed bottom-0 dark:bg-slate-950/95 dark:text-white" />
      </div>
    </div>
  );
};

export default Layout;