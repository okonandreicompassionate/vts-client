import { useState } from "react";
import { Button } from "antd";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { paths } from "../../../config/paths";
import { useTenant } from "../../../lib/tenant";
import { ThemeToggle } from "../../../components/theme-toggle";

const ORBS = [
  { top: "4%", left: "8%", size: 220, color: "#22C55E" },
  { top: "60%", left: "2%", size: 160, color: "#2DD4BF" },
  { top: "8%", left: "80%", size: 190, color: "#F59E0B" },
  { top: "50%", left: "88%", size: 230, color: "#22C55E" },
  { top: "84%", left: "76%", size: 140, color: "#38BDF8" },
];

const RAIN_COLORS = ["#16A34A", "#22C55E", "#2DD4BF", "#38BDF8", "#F59E0B"];
const RAIN_COUNT = 45;

export default function LandingPage() {
  const navigate = useNavigate();
  const { orgSlug } = useTenant();

  const [drops] = useState(() =>
    Array.from({ length: RAIN_COUNT }, (_, i) => {
      const color = RAIN_COLORS[i % RAIN_COLORS.length];
      return {
        left: Math.random() * 100,
        height: 50 + Math.random() * 90,
        duration: 2 + Math.random() * 2.4,
        delay: Math.random() * -5,
        opacity: 0.3 + Math.random() * 0.4,
        color,
      };
    }),
  );

  return (
    <div
      className="relative isolate flex min-h-screen w-full items-center justify-center overflow-hidden bg-white px-4 py-10 dark:bg-slate-900"
      style={{ position: "relative", isolation: "isolate" }}
    >
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      <style>{`
        @keyframes rain-fall {
          0% { transform: translateY(-15vh); }
          100% { transform: translateY(115vh); }
        }
      `}</style>

      {/* base wash */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          zIndex: 0,
          background: "radial-gradient(120% 90% at 50% 12%, #F0FBF4 0%, #FFFFFF 55%, #FFFFFF 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 hidden dark:block"
        style={{
          zIndex: 0,
          background: "radial-gradient(120% 90% at 50% 12%, #1e293b 0%, #0f172a 55%, #0f172a 100%)",
        }}
      />

      {/* ambient orbs, static */}
      <div className="pointer-events-none absolute inset-0" style={{ zIndex: 1 }}>
        {ORBS.map((orb, i) => (
          <div
            key={i}
            className="absolute rounded-full blur-3xl"
            style={{
              top: orb.top,
              left: orb.left,
              width: orb.size,
              height: orb.size,
              background: `radial-gradient(circle at 35% 30%, ${orb.color}66, ${orb.color}22 60%, transparent 75%)`,
            }}
          />
        ))}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(#0f1f18 1px, transparent 1px), linear-gradient(90deg, #0f1f18 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />
      </div>

      {/* rain */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: 2 }}>
        {drops.map((drop, i) => (
          <div
            key={i}
            className="absolute top-0"
            style={{
              left: `${drop.left}%`,
              width: 2,
              height: drop.height,
              opacity: drop.opacity,
              background: `linear-gradient(to bottom, transparent, ${drop.color}, transparent)`,
              animation: `rain-fall ${drop.duration}s linear ${drop.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* content */}
      <div className="relative flex w-full max-w-md flex-col items-center" style={{ zIndex: 3 }}>
        <img
          src="/logo.png"
          alt="Zoracom"
          loading="lazy"
          style={{ height: 20, width: "auto" }}
          className="mb-6 opacity-90"
        />

        <header className="mb-8 flex flex-col items-center text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-[#10241C] md:text-[28px] dark:text-slate-100">
            Visitor Tracking System
          </h1>
          <p className="mt-1.5 text-sm text-[#10241C]/45 dark:text-slate-400">
            Check in below to begin your visit
          </p>
        </header>

        <div className="relative w-full rounded-2xl border border-black/5 bg-white/85 p-3 shadow-[0_30px_80px_-20px_rgba(16,36,28,0.22)] backdrop-blur-xl md:p-4 dark:border-slate-800 dark:bg-slate-800/85">
          {/* punch hole + dashed lanyard line */}
          <div className="absolute top-0 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white ring-1 ring-black/5" />
          <div className="absolute top-2 left-1/2 h-px w-[85%] -translate-x-1/2 border-t border-dashed border-black/10" />

          <div className="overflow-hidden rounded-xl ring-1 ring-black/5">
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

        <p className="mt-6 text-base text-[#10241C]/30 dark:text-slate-400">
          Zoracom © {new Date().getFullYear()} · Secured visitor access
        </p>
      </div>
    </div>
  );
}
