import { VisitorAvatar } from "./visitor-avatar";

type VisitorIdentityCellProps = {
  name: string;
  phone: string;
};

type VisitDateTimeCellProps = {
  date?: string;
  time: string;
};

export function VisitorIdentityCell({
  name,
  phone,
}: VisitorIdentityCellProps) {
  return (
    <div className="flex items-center gap-3">
      <VisitorAvatar name={name} size="md" />

      <div className="flex min-w-0 flex-col gap-1">
        <span className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
          {name}
        </span>

        <span className="truncate text-xs text-slate-400">
          {phone}
        </span>
      </div>
    </div>
  );
}

export function VisitDateTimeCell({
  date,
  time,
}: VisitDateTimeCellProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
        {time}
      </span>

      {date && (
        <span className="text-xs text-slate-400">
          {date}
        </span>
      )}
    </div>
  );
}
