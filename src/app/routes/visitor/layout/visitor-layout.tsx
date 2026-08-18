import LeftLayout from "@/components/layout/left-layout";
import { Outlet } from "react-router-dom";
import Header from "../../../../components/layout/header";

const VisitorLayout = () => {
  return (
    <div className="flex min-h-screen w-full md:flex-row">
      <LeftLayout />

      <div className="flex mt-4 min-h-screen w-full flex-col bg-white sm:px-6 md:px-10 lg:px-14 dark:bg-slate-900">
        <Header />

        <main className="flex min-h-0 flex-1 w-full justify-center px-4 pt-6 sm:px-6 sm:pt-8 md:items-center md:px-10 md:pt-0">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default VisitorLayout;