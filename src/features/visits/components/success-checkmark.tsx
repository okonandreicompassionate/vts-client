import { motion } from "framer-motion";

type SuccessCheckmarkProps = {
  size?: number;
};

export default function SuccessCheckmark({
  size = 64,
}: SuccessCheckmarkProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
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
        <motion.circle
          cx="32"
          cy="32"
          r="28"
          stroke="currentColor"
          strokeWidth="3"
          className="text-emerald-500"
          initial={{
            pathLength: 0,
            opacity: 0,
          }}
          animate={{
            pathLength: 1,
            opacity: 1,
          }}
          transition={{
            pathLength: {
              duration: 0.6,
              ease: "easeOut",
            },
            opacity: {
              duration: 0.2,
            },
          }}
        />

        <motion.path
          d="M20 33.5L28 41L45 24"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-emerald-500"
          initial={{
            pathLength: 0,
            opacity: 0,
          }}
          animate={{
            pathLength: 1,
            opacity: 1,
          }}
          transition={{
            pathLength: {
              duration: 0.45,
              delay: 0.5,
              ease: "easeOut",
            },
            opacity: {
              duration: 0.15,
              delay: 0.5,
            },
          }}
        />
      </svg>
    </motion.div>
  );
}