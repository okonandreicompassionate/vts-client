import { Button } from "antd";
import { RightOutlined } from "@ant-design/icons";

import type { OrganizationChoice } from "../types/api-types";

interface OrganizationPickerProps {
  organizations: OrganizationChoice[];
  isSelecting: boolean;
  onSelect: (orgId: string) => void;
  onCancel: () => void;
}

export default function OrganizationPicker({
  organizations,
  isSelecting,
  onSelect,
  onCancel,
}: OrganizationPickerProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-center text-sm text-slate-600 dark:text-zinc-300">
        Your account belongs to more than one organization. Choose where to sign in.
      </p>

      <ul className="flex flex-col gap-2">
        {organizations.map((organization) => (
          <li key={organization.id}>
            <Button
              block
              disabled={isSelecting}
              onClick={() => onSelect(organization.id)}
              className="flex! h-auto! items-center! justify-between! rounded-md! border-slate-200! px-3! py-2.5! text-left! dark:border-zinc-600! dark:bg-zinc-800!"
            >
              <span className="flex flex-col">
                <span className="text-sm font-semibold text-slate-900 dark:text-zinc-100">
                  {organization.name}
                </span>
                <span className="text-xs text-slate-500 dark:text-zinc-400">
                  {organization.slug}
                </span>
              </span>
              <RightOutlined className="text-slate-400" />
            </Button>
          </li>
        ))}
      </ul>

      <Button type="link" onClick={onCancel} disabled={isSelecting} className="text-xs!">
        Use a different account
      </Button>
    </div>
  );
}
