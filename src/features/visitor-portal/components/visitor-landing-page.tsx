import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useOrganization } from "@/features/visitor-portal";
import { Button } from "antd";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { paths } from "../../../config/paths";
import { LandingPageBackground } from "../animations/landing-page-background";

export default function LandingPage() {
  const navigate = useNavigate();
  const { orgSlug } = useOrganization();

  return (
    <div
      className="relative isolate flex min-h-screen w-full items-center justify-center overflow-hidden bg-white px-4 py-10 dark:bg-zinc-900"
      style={{ position: "relative", isolation: "isolate" }}
    >
      <LandingPageBackground />

      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      {/* content */}
      <div className="relative flex w-full max-w-md flex-col items-center" style={{ zIndex: 3 }}>
        <img src="/logo.svg" alt="GuestX" className="h-8 w-auto opacity-90" />

        <header className="mb-8 flex flex-col items-center text-center">
          {/* <h1 className="text-xl font-semibold tracking-tight text-[#10241C] md:text-[28px] dark:text-zinc-100">
            Visitor Experience
          </h1> */}
          <p className="text-sm text-[#10241C]/55 dark:text-zinc-400">
            Check in below to begin your visit
          </p>
        </header>

        <div className="relative w-full rounded-2xl border border-black/5 bg-white/85 p-3 backdrop-blur-xl md:p-4 dark:border-zinc-800 dark:bg-zinc-800/85">
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
            className="mt-3 h-12 rounded-xl border-none bg-emerald-600 font-semibold hover:bg-emerald-500!"
            icon={<ArrowRight size={18} />}
            iconPlacement="end"
          >
            Get Started
          </Button>
        </div>

        <p className="mt-6 text-xs text-[#10241C]/70 dark:text-zinc-400">
          GuestX © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
