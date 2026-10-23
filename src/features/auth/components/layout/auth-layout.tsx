import React from "react";
import LeftLayout from "@/components/layout/left-layout";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/mobile-header";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#f5f9f9] md:flex-row dark:bg-slate-950">
      <div className="hidden min-h-screen w-full md:block md:w-1/2 lg:w-3/5">
        <LeftLayout />
      </div>

      <main className="flex min-h-screen w-full flex-col items-center justify-center px-5 py-8 sm:px-8 md:w-1/2 md:px-8 lg:w-2/5 lg:px-12">
        <Header />

        <div className="w-full max-w-md">{children}</div>
      </main>

      <div className="fixed top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      <Footer className="!absolute !bottom-8 !left-0 !hidden !w-1/2 !bg-transparent !px-10 md:!block lg:!w-3/5 lg:!px-12 dark:!bg-slate-950" />
    </div>
  );
}
