import { motion } from "framer-motion";
import { loadingVariants } from "../animations/success-modal-variants";
export default function LoadingRing({ size = 64 }: { size?: number }) {
  return (
    <motion.div
      variants={loadingVariants}
      style={{ width: size, height: size }}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        ease: "linear",
        repeat: Infinity,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="28" stroke="#E2E8F0" strokeWidth="3" />

        <motion.circle
          cx="32"
          cy="32"
          r="28"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className="text-sky-500"
          strokeDasharray="40 176"
          animate={{
            strokeDashoffset: [0, -176],
          }}
          transition={{
            duration: 1.2,
            ease: "linear",
            repeat: Infinity,
          }}
        />
      </svg>
    </motion.div>
  );
}
