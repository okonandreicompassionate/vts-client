import { useState } from "react";
import { Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";

import AdminHeader from "@/app/routes/admin/layout/dashboard-header";
import TableComponent from "@/components/ui/table";
import { paths } from "@/config/paths";
import { useGetAdminsQuery } from "@/features/users/api/users-api-slice";
import { useTenant } from "@/lib/tenant";

import type { AdminRole, AdminUserItem } from "@/features/users/types/api-types";

import type { User } from "../types/types";
import UserIdentityCell from "./user-identity-cell";
import StatusPill from "../components/status-pill";
import AddUserModal from "./modal/add-user-modal";
import { Spinner } from "@/components/ui/spinner";

export default function UsersPage() {
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);

  const navigate = useNavigate();
  const { orgSlug } = useTenant();

  const { data: admins = [], isLoading } = useGetAdminsQuery();

  const users: User[] = admins.map((admin: AdminUserItem) => ({
    id: admin.id,
    name: admin.fullName || admin.email,
    email: admin.email,
    role: admin.role,
    status: "active",
  }));

  const columns: ColumnsType<User> = [
    {
      title: "Name",
      key: "name",
      render: (_value, record) => <UserIdentityCell name={record.name} email={record.email} />,
    },

    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: AdminRole) => (
        <span className="text-[12px] text-slate-700 dark:text-slate-300">{role}</span>
      ),
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: User["status"]) => <StatusPill status={status} />,
    },
  ];

  const handleRowClick = (record: User) => {
    navigate(paths.admin.userDetails.getHref(orgSlug, record.id));
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <AdminHeader title="Users" />

      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-3 dark:border-slate-800">
        <div className="min-w-0">
          {!isLoading && (
            <p className="text-[13px] text-slate-500 dark:text-slate-400">
              {users.length} {users.length === 1 ? "user" : "users"}
            </p>
          )}
        </div>

        <Button
          size="small"
          type="primary"
          className="flex h-7 gap-1 text-[13px]"
          onClick={() => setInviteModalOpen(true)}
        >
          <img src="/add-users.svg" alt="" className="h-3 w-3 inline-flex items-center" />
          <span className="text-xs">Invite User</span>
        </Button>
      </div>

      <div className="relative min-h-0 px-3 py-4">
        <TableComponent<User>
          columns={columns}
          dataSource={users}
          rowKey="id"
          showSerialNumber
          serialNumberTitle="SN"
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
            style: {
              cursor: "pointer",
            },
          })}
        />

        {isLoading && <Spinner variant="inline" overlay />}
      </div>

      <AddUserModal open={isInviteModalOpen} onCancel={() => setInviteModalOpen(false)} />
    </div>
  );
}
