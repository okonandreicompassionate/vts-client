import { Outlet } from "react-router-dom";
import LoginLeft from "@/features/admins/components/layout/login-left"; // adjust to your actual path

const Layout = () => {
  return (
    <div className="grid h-screen w-full bg-slate-50 md:grid-cols-2 dark:bg-slate-950">
      <div className="hidden h-full md:block">
        <LoginLeft />
      </div>

      <div className="flex min-h-full w-full flex-col items-center justify-center bg-white px-4 py-10 sm:px-6 md:px-10 lg:px-14 dark:bg-slate-950">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;