import React from "react";
import LeftLayout from "@/components/layout/left-layout";
import Header from "@/components/layout/mobile-header";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row">
      <div className="hidden min-h-screen w-full md:block md:w-1/2">
        <LeftLayout />
      </div>

      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white px-4 py-6 sm:px-6 md:w-1/2 md:px-16 md:py-12 dark:bg-slate-950">
        <div className="flex items-center">
          <Header/>
        </div>

        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}