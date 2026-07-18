import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#EEF2F7]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;