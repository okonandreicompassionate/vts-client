import { motion } from "framer-motion";
import { circleDraw, checkDraw, iconVariants } from "../../animations/success-modal-variants";

export default function SuccessCheckmark({ size = 64 }: { size?: number }) {
  return (
    <motion.div variants={iconVariants} style={{ width: size, height: size }}>
      <svg viewBox="0 0 64 64" width={size} height={size} fill="none">
        <motion.circle
          cx="32"
          cy="32"
          r="28"
          stroke="currentColor"
          strokeWidth="3"
          className="text-emerald-500"
          variants={circleDraw}
        />
        <motion.path
          d="M20 33.5L28 41L45 24"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-emerald-500"
          variants={checkDraw}
        />
      </svg>
    </motion.div>
  );
}