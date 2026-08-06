import { Spin } from "antd";

type SpinnerVariant = "inline" | "page" | "screen";

interface SpinnerProps {
  variant?: SpinnerVariant;
  label?: string;
  className?: string;
}

const variantClasses: Record<SpinnerVariant, string> = {
  inline: "min-h-[240px]",
  page: "h-full min-h-[400px]",
  screen: "fixed inset-0",
};

export const Spinner = ({ variant = "inline", label, className = "" }: SpinnerProps) => {
  return (
    <div
      className={`flex w-full flex-col items-center justify-center gap-3 ${variantClasses[variant]} ${className}`}
    >
      <Spin size="large" />
      {label && <p className="text-sm text-slate-400">{label}</p>}
    </div>
  );
};
