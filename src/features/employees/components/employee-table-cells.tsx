import { Avatar } from "@/components/ui/avatar";

type EmployeeIdentityCellProps = {
  name: string;
  employeeId: string;
};

export function EmployeeIdentityCell({
  name,
  employeeId,
}: EmployeeIdentityCellProps) {
  return (
    <div className="flex items-center gap-2">
      <Avatar name={name} size="sm" />

      <div className="flex min-w-0 flex-col leading-none">
        <span className="truncate text-[12px] text-slate-800 dark:text-slate-100">
          {name}
        </span>

        <span className="mt-0.5 truncate text-[10px] text-slate-500 dark:text-slate-400">
          {employeeId}
        </span>
      </div>
    </div>
  );
}