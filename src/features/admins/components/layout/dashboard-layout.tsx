import { Outlet } from "react-router-dom";
import Sidebar from "@/features/admins/components/layout/sidebar";
import { useAdminAuthSession } from "../../hooks/use-admin-auth-session";
import { useAppSelector } from "@/lib/stores/hooks";
import { useNotificationSocket } from "../../hooks/use-notification-socket";

const Layout = () => {
  useAdminAuthSession();

  const token = useAppSelector(
    (state) => state.adminAuth.token,
  );

  useNotificationSocket({
    token: token ?? undefined,
  });

  return (
    <div className="flex min-h-screen flex-col bg-[#EEF2F7] md:flex-row dark:bg-slate-900">
      <Sidebar />
      <div className="flex w-full min-w-0 flex-1 flex-col md:ml-0">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
