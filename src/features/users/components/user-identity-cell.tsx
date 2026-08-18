import { Avatar } from "@/components/ui/avatar";

interface UserIdentityCellProps {
  name: string;
  email?: string;
}

export default function EmployeeIdentityCell({
  name,
  email,
}: UserIdentityCellProps) {
  return (
    <div className="flex items-center gap-2">
      <Avatar name={name} size="sm" />

      <div className="flex min-w-0 flex-col -space-y-0.5">
        <span className="truncate text-[12px] text-slate-800 dark:text-slate-100">
          {name}
        </span>

        {email && (
          <span className="truncate text-[11px] text-slate-500 dark:text-slate-400">
            {email}
          </span>
        )}
      </div>
    </div>
  );
}