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
    <div className="relative grid min-h-dvh w-full grid-cols-1 bg-white md:grid-cols-2 dark:bg-zinc-950">
      <div className="hidden min-h-dvh min-w-0 md:block">
        <LeftLayout />
      </div>

      <main className="flex min-h-dvh w-full min-w-0 flex-col items-center justify-center px-5 py-6 lg:px-12">
        <Header />

        <div className="w-full max-w-md">{children}</div>
      </main>

      <div className="fixed top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      <Footer className="!absolute !bottom-8 !left-0 !hidden !w-1/2 !bg-transparent !px-10 md:!block lg:!px-12 dark:!bg-transparent" />
    </div>
  );
}
