import { Avatar } from "@/components/ui/avatar";

interface UserIdentityCellProps {
  name: string;
  phoneNo?: string;
}

export default function EmployeeIdentityCell({ name, phoneNo }: UserIdentityCellProps) {
  return (
    <div className="flex items-center gap-2">
      <Avatar name={name} size="sm" />

      <div className="inline-flex min-w-0 flex-col">
        <span className="truncate text-[12px] text-slate-800 dark:text-slate-100">{name}</span>

        {phoneNo && (
          <span className="-mt-1 truncate text-[11px] text-slate-500 dark:text-slate-400">
            {phoneNo}
          </span>
        )}
      </div>
    </div>
  );
}
