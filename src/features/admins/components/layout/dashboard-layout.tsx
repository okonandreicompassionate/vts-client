import { Outlet } from "react-router-dom";
import Sidebar from "../layout/sidebar";
import { useAdminAuthSession } from "../../hooks/use-admin-auth-session";

const Layout = () => {
  useAdminAuthSession();
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
