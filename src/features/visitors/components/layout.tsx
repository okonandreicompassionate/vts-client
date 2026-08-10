import { Outlet } from "react-router-dom";

import LeftLayout from "@/components/left-layout";

const Layout = () => {
  return (
    <div className="flex h-screen w-full">
      <LeftLayout />

      <div className="flex min-h-full w-full flex-col items-center justify-center bg-white px-4 py-10 sm:px-6 md:px-10 lg:px-14 dark:bg-slate-900">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;