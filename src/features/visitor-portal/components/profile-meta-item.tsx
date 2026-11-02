type MetaItemProps = {
  label: string;
  value: React.ReactNode;
  className?: string;
};

export default function MetaItem({ label, value, className = "" }: MetaItemProps) {
  return (
    <div className={`flex min-w-0 w-full flex-col gap-0.5 ${className}`}>
      <p className="text-[11px] font-medium tracking-wide text-slate-400 uppercase">
        {label}
      </p>

      <div className="min-w-0 wrap-anywhere text-[13px] font-bold text-slate-900 dark:text-slate-100">
        {value}
      </div>
    </div>
  );
}
