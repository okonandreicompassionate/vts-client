import { motion } from "framer-motion";

type LoadingRingProps = {
  size?: number;
  className?: string;
};

export default function LoadingRing({
  size = 64,
  className = "text-sky-500",
}: LoadingRingProps) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        ease: "linear",
        repeat: Infinity,
      }}
      style={{
        width: size,
        height: size,
      }}
      className="shrink-0"
    >
      <svg
        viewBox="0 0 64 64"
        width={size}
        height={size}
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="32"
          cy="32"
          r="28"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="40 176"
          className={className}
        />
      </svg>
    </motion.div>
  );
}