import React from "react";
import LoginLeft from "../../components/layout/LoginLeft";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex h-full min-h-screen w-full flex-col justify-center bg-white md:flex-row dark:bg-slate-900">
      <LoginLeft />

      <header className="flex flex-col items-center justify-center gap-4 px-4 py-8 sm:hidden sm:px-6 md:px-16 md:py-12">
        <img src="/logo.svg" alt="" className="w-32 object-cover lg:mt-0 lg:-mb-40 lg:ml-40" />
        <h2 className="text-2xl font-bold text-slate-800 md:text-3xl lg:ml-3 dark:text-slate-100">
          Visitor Tracker
        </h2>
      </header>

     
      <div className="flex h-full w-full items-center justify-center bg-slate-50 px-4 py-8 sm:px-6 sm:py-10 md:w-1/2 md:px-8 md:py-16 dark:bg-slate-950">
        {children}
      </div>
    </div>
  );
}
