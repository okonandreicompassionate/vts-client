import { Spin } from "antd";

type SpinnerVariant = "inline" | "page" | "screen";

interface SpinnerProps {
  variant?: SpinnerVariant;
  label?: string;
  className?: string;
  overlay?: boolean;
}

const variantClasses: Record<SpinnerVariant, string> = {
  inline: "flex items-center justify-center",
  page: "flex min-h-[calc(100vh-4rem)] items-center justify-center",
  screen:
    "fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-slate-900/80",
};

export const Spinner = ({
  variant = "inline",
  label,
  className = "",
  overlay = false,
}: SpinnerProps) => {
  const containerClasses = overlay
    ? "absolute inset-0 z-20 flex items-center justify-center"
    : variantClasses[variant];

  return (
    <div className={`w-full ${containerClasses} ${className}`}>
      <div className="flex flex-col items-center justify-center gap-3">
        <Spin size="medium" />

        {label && (
          <p className="text-sm text-slate-400">
            {label}
          </p>
        )}
      </div>
    </div>
  );
};