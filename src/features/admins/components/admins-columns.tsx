import type { ColumnsType } from "antd/es/table";
import type { AdminRole } from "@/features/admins/types/api-types";
import type { Admin } from "../types/types";
import AdminIdentityCell from "./admin-identity-cell";
import { formatRole } from "@/utils/format-role";

export const adminColumns: ColumnsType<Admin> = [
  {
    title: "Name & Phone no.",
    key: "name",
    render: (_value, record) => (
      <AdminIdentityCell name={record.name} phoneNo={record.phoneNumber} />
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