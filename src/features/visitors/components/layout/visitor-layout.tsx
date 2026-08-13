import LeftLayout from "@/components/layout/left-layout";
import { Outlet } from "react-router-dom";
import VisitorHeader from "./visitor-header";

const VisitorLayout = () => {
  return (
    <div className="flex min-h-screen w-full">
      <LeftLayout />

      <div className="pt-4 flex min-h-screen w-full flex-col bg-white sm:px-6 md:px-10 lg:px-14 dark:bg-slate-900">
        <VisitorHeader />

        <main className="flex w-full justify-center px-4 pt-6 sm:pt-8">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default VisitorLayout;