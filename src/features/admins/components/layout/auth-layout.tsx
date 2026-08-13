import React from "react";
import LeftLayout from "@/components/layout/left-layout";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="grid h-screen w-full md:grid-cols-2">
      <div className="hidden h-full md:block">
        <LeftLayout />
      </div>

      <div className="flex min-h-full w-full flex-col items-center justify-center px-4 py-6 sm:px-6 md:px-16 md:py-12 dark:bg-slate-950">
        <header className="flex flex-col items-center gap-3 pb-2 md:hidden">
          <img src="/logo.svg" alt="" className="w-32 object-cover" />
          <h2 className="text-[20px] font-bold text-slate-800 dark:text-slate-100">
            Visitor Tracker
          </h2>
        </header>

        <div className="flex w-full max-w-md flex-col items-center">
          {children}
        </div>
      </div>
    </div>
  );
}
