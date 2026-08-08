import { useState } from "react";

const ORBS = [
  { top: "4%", left: "8%", size: 220, color: "#22C55E" },
  { top: "60%", left: "2%", size: 160, color: "#2DD4BF" },
  { top: "8%", left: "80%", size: 190, color: "#F59E0B" },
  { top: "50%", left: "88%", size: 230, color: "#22C55E" },
  { top: "84%", left: "76%", size: 140, color: "#38BDF8" },
];

const RAIN_COLORS = ["#16A34A", "#22C55E", "#2DD4BF", "#38BDF8", "#F59E0B"];
const RAIN_COUNT = 45;

export function LandingPageBackground() {
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
    <>
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
    </>
  );
}