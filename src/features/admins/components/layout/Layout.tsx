import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout = () => {
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
