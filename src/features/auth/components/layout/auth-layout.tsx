import React from "react";
import LeftLayout from "@/components/layout/left-layout";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/mobile-header";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      <div className="flex min-h-0 w-full flex-1 flex-col md:flex-row">
        <div className="hidden h-full min-h-0 w-full md:block md:w-1/2">
          <LeftLayout />
        </div>

        <div className="flex h-full min-h-0 w-full flex-col items-center justify-center overflow-y-auto bg-white px-4 py-6 sm:px-6 md:w-1/2 md:px-16 md:py-12 dark:bg-slate-950">
          <div className="flex items-center">
            <Header/>
          </div>

          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </div>

      <Footer className="hidden md:block" />
    </div>
  );
}