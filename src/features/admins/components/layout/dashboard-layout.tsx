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
    <div>
      <Sidebar />
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
