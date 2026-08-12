import { Spin } from "antd";

type SpinnerVariant = "inline" | "page" | "screen";

interface SpinnerProps {
  variant?: SpinnerVariant;
  label?: string;
  className?: string;
}

const variantClasses: Record<SpinnerVariant, string> = {
  inline: "min-h-[240px]",
  page: "min-h-[calc(100vh-4rem)]",
  screen: "fixed inset-0 z-50 min-h-screen bg-white/80 backdrop-blur-sm",
};

export const Spinner = ({
  variant = "page",
  label,
  className = "",
}: SpinnerProps) => {
  return (
    <div
      className={`flex w-full flex-col items-center justify-center gap-3 ${variantClasses[variant]} ${className}`}
    >
      <Spin size="default" />

      {label && (
        <p className="text-sm text-slate-400">
          {label}
        </p>
      )}
    </div>
  );
};