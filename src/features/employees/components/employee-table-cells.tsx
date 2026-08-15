import { Avatar } from "@/components/ui/avatar";

type EmployeeIdentityCellProps = {
  name: string;
};
export function EmployeeIdentityCell({
  name,

}: EmployeeIdentityCellProps) {
  return (
    <div className="flex items-center gap-2">
      <Avatar name={name} size="sm" />

      <div className="flex min-w-0 flex-col -space-y-0.5">
        <span className="truncate text-[12px] text-slate-800 dark:text-slate-100">
          {name}
        </span>

      </div>
    </div>
  );
}