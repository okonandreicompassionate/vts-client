import type { LucideIcon } from "lucide-react";

type MetaItemProps = {
  label: string;
  value: React.ReactNode;
  className?: string;
  icon: LucideIcon;
};

export default function MetaItem({ label, value, icon: Icon, className = "" }: MetaItemProps) {
  return (
    <div
      className={`flex w-full min-w-0 items-start gap-2 rounded-xl border border-slate-200 bg-white p-2.5 shadow-xs dark:border-zinc-700 dark:bg-zinc-900 ${className}`}
    >
      <span className="flex size-8.5 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 shadow-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
        <Icon className="size-4 " strokeWidth={1.75} aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <dt className="text-[10px] leading-4 font-medium text-slate-500 dark:text-zinc-400">
          {label}
        </dt>
        <dd className=" min-w-0 text-xs leading-5 font-semibold wrap-anywhere text-slate-900 dark:text-zinc-100">
          {value}
        </dd>
      </div>
    </div>
  );
}
