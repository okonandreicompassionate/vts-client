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
      <div className="hidden min-h-screen w-full md:block md:w-1/2">
        <LeftLayout />
      </div>

      <main className="flex min-h-screen w-full flex-col items-center justify-center px-5 py-8 sm:px-8 md:w-1/2 md:px-10 lg:px-16">
        <Header />

        <div className="w-full max-w-xs md:w-[min(100%,24vw)]">{children}</div>
      </main>

      <div className="fixed top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      <Footer className="!absolute !bottom-8 !left-0 !hidden !w-1/2 !bg-transparent !px-10 md:!block lg:!px-12 dark:!bg-slate-950" />
    </div>
  );
}
