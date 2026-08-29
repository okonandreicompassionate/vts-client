import type { ColumnsType } from "antd/es/table";
import type { AdminRole } from "@/features/admins/types/api-types";
import type { User } from "../types/types";
import UserIdentityCell from "./admin-identity-cell";
import { formatRole } from "@/utils/format-role";

export const userColumns: ColumnsType<User> = [
  {
    title: "Name & Phone no.",
    key: "name",
    render: (_value, record) => (
      <UserIdentityCell name={record.name} phoneNo={record.phoneNumber} />
    ),
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    render: (email: string) => (
      <span className="text-[12px] text-slate-700 dark:text-slate-300">
        {email}
      </span>
    ),
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
    render: (role: AdminRole) => (
      <span className="text-[12px] text-slate-700 dark:text-slate-300">
        {formatRole(role)}
      </span>
    ),
  },
];