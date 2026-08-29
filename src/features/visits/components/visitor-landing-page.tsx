import { Button } from "antd";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LandingPageBackground } from "../animations/landing-page-background";
import { paths } from "../../../config/paths";
import { useOrganization } from "@/features/organizations";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function LandingPage() {
  const navigate = useNavigate();
  const { orgSlug } = useOrganization();

  return (
    <div
      className="relative isolate flex min-h-screen w-full items-center justify-center overflow-hidden bg-white px-4 py-10 dark:bg-slate-900"
      style={{ position: "relative", isolation: "isolate" }}
    >
      <LandingPageBackground />

      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      {/* content */}
      <div className="relative flex w-full max-w-md flex-col items-center" style={{ zIndex: 3 }}>
        <img src="/logo.png" alt="Zoracom" loading="lazy" className="mb-6 h-5 w-auto opacity-90" />

        <header className="mb-8 flex flex-col items-center text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-[#10241C] md:text-[28px] dark:text-slate-100">
            Visitor Tracking System
          </h1>
          <p className="mt-1.5 text-sm text-[#10241C]/55 dark:text-slate-400">
            Check in below to begin your visit
          </p>
        </header>

        <div className="relative w-full rounded-2xl border border-black/5 bg-white/85 p-3 shadow-[0_30px_80px_-20px_rgba(16,36,28,0.22)] backdrop-blur-xl md:p-4 dark:border-slate-800 dark:bg-slate-800/85">
          <div className="overflow-hidden rounded-xl">
            <img
              src="/nsoc-building.png"
              alt="Zoracom NSOC building"
              loading="lazy"
              className="h-48 w-full object-cover md:h-56"
            />
          </div>

          <Button
            type="primary"
            size="large"
            block
            onClick={() => navigate(paths.verify.getHref(orgSlug))}
            className="mt-3 h-12 rounded-xl border-none bg-emerald-600 font-semibold shadow-[0_10px_30px_-8px_rgba(5,150,105,0.5)] hover:bg-emerald-500!"
            icon={<ArrowRight size={18} />}
            iconPlacement="end"
          >
            Get Started
          </Button>
        </div>

        <p className="mt-6 text-xs text-[#10241C]/70 dark:text-slate-400">
          Zoracom © {new Date().getFullYear()} · Secured visitor access
        </p>
      </div>
    </div>
  );
}
