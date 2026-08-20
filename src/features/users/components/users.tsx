import { useState } from "react";

import { Button, Checkbox, Modal, message } from "antd";

import type { ColumnsType } from "antd/es/table";

import { useNavigate } from "react-router-dom";

import AdminHeader from "@/app/routes/admin/layout/dashboard-header";

import TableComponent from "@/components/ui/table";

import { paths } from "@/config/paths";

import {
  useGetAdminsQuery,
  useBulkDeleteAdminsMutation,
} from "@/features/users/api/users-api-slice";

import { useTenant } from "@/lib/tenant";

import { Spinner } from "@/components/ui/spinner";

import type {
  AdminRole,
  AdminUserItem,
} from "@/features/users/types/api-types";

import type { User } from "../types/types";

import UserIdentityCell from "./user-identity-cell";

import AddUserModal from "./modals/add-user-modal";

import { useUsersSSE } from "../hooks/use-users-sse";

export default function UsersPage() {
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);

  const [isSelecting, setIsSelecting] = useState(false);

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const navigate = useNavigate();

  const { orgSlug } = useTenant();

  useUsersSSE();

  const {
    data: admins = [],
    isLoading,
    isError,
  } = useGetAdminsQuery();

  const [bulkDeleteAdmins, { isLoading: isDeleting }] =
    useBulkDeleteAdminsMutation();

  const users: User[] = admins.map((admin: AdminUserItem) => ({
    id: admin.id,
    name: admin.fullName || admin.email,
    email: admin.email,
    role: admin.role,
    phoneNumber: admin.phoneNumber,
  }));

  const handleToggleSelection = (id: string) => {
    setSelectedRowKeys((current) =>
      current.includes(id)
        ? current.filter((key) => key !== id)
        : [...current, id],
    );
  };

  const handleStartSelecting = () => {
    setIsSelecting(true);
  };

  const handleCancelSelecting = () => {
    setSelectedRowKeys([]);
    setIsSelecting(false);
  };

  const handleDeleteSelected = () => {
    const count = selectedRowKeys.length;

    Modal.confirm({
      title: `Delete ${count} ${count === 1 ? "user" : "users"}?`,
      content:
        "This action cannot be undone. Selected users will lose access immediately.",
      okText: "Delete",
      okButtonProps: {
        danger: true,
      },
      onOk: async () => {
        try {
          await bulkDeleteAdmins({
            ids: selectedRowKeys as string[],
          }).unwrap();

          message.success(
            count === 1 ? "User deleted" : "Users deleted",
          );

          setSelectedRowKeys([]);
          setIsSelecting(false);
        } catch {
          message.error("Failed to delete selected users");
        }
      },
    });
  };

  const columns: ColumnsType<User> = [
    ...(isSelecting
      ? [
          {
            title: "",
            key: "selection",
            width: 32,
            align: "center" as const,
            render: (_value: unknown, record: User) => (
              <Checkbox
                checked={selectedRowKeys.includes(record.id)}
                onChange={() => handleToggleSelection(record.id)}
                onClick={(event) => event.stopPropagation()}
                className="users-table-checkbox"
              />
            ),
          },
        ]
      : []),

    {
      title: "Name & Phone no.",
      key: "name",
      render: (_value, record) => (
        <UserIdentityCell
          name={record.name}
          phoneNo={record.phoneNumber}
        />
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
          {role}
        </span>
      ),
    },
  ];

  const handleRowClick = (record: User) => {
    if (isSelecting) {
      return;
    }

    navigate(
      paths.admin.userDetails.getHref(orgSlug, record.id),
    );
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <AdminHeader title="Users" />

      <div className="flex min-h-12.5 items-center justify-between border-b border-slate-200 px-5 py-2 dark:border-slate-800">
        <div className="flex min-w-0 items-center gap-2.5">
          {!isLoading && !isError && !isSelecting && (
            <>
              <span className="text-[13px] text-slate-500 dark:text-slate-400">
                {users.length}{" "}
                {users.length === 1 ? "user" : "users"}
              </span>

              <button
                type="button"
                onClick={handleStartSelecting}
                className="flex h-5.5 items-center justify-center rounded-sm bg-sky-500 px-2 text-[12px] leading-none font-medium text-white transition-colors hover:bg-sky-600 active:bg-sky-700"
              >
                Select
              </button>
            </>
          )}

          {isSelecting && (
            <div className="flex h-7 items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-1.5 dark:border-slate-700 dark:bg-slate-800/60">
              <span className="flex h-6 items-center px-1 text-[12px] leading-none font-medium text-slate-700 dark:text-slate-200">
                {selectedRowKeys.length} selected
              </span>

              <span className="h-3.5 w-px shrink-0 bg-slate-300 dark:bg-slate-600" />

              <button
                type="button"
                onClick={handleCancelSelecting}
                className="flex h-6 items-center justify-center rounded text-[11px] leading-none font-medium text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={selectedRowKeys.length === 0 || isDeleting}
                onClick={handleDeleteSelected}
                className="flex h-6 cursor-pointer items-center justify-center rounded px-1.5 text-[11px] leading-none font-medium text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 dark:text-red-400 dark:hover:bg-red-950/40 dark:hover:text-red-300"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          )}

          {isError && (
            <span className="text-[13px] text-red-500">
              Unable to load users
            </span>
          )}
        </div>

        {isSelecting && (
          <div className="flex h-7 items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-1.5 dark:border-slate-700 dark:bg-slate-800/60">
            <span className="px-1 text-[12px] font-medium text-slate-700 dark:text-slate-200">
              {selectedRowKeys.length} selected
            </span>

            <span className="mx-0.5 h-3.5 w-px bg-slate-300 dark:bg-slate-600" />

            <Button
              type="text"
              size="small"
              onClick={handleCancelSelecting}
              className="selection-action-btn h-6! px-1! text-[11px]!"
            >
              Cancel
            </Button>

            <Button
              type="text"
              size="small"
              loading={isDeleting}
              onClick={
                selectedRowKeys.length > 0
                  ? handleDeleteSelected
                  : undefined
              }
              className={`selection-delete-btn h-6! px-1! text-[11px]! ${
                selectedRowKeys.length === 0
                  ? "selection-delete-disabled"
                  : "selection-delete-active"
              }`}
            >
              Delete
            </Button>
          </div>
        )}
      </div>

      <div className="relative min-h-0 px-3 py-3">
        <TableComponent<User>
          columns={columns}
          dataSource={users}
          rowKey="id"
          showSerialNumber
          serialNumberTitle="SN"
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
            style: {
              cursor: isSelecting ? "default" : "pointer",
            },
          })}
        />

        {isLoading && (
          <Spinner
            variant="inline"
            overlay
            className="bg-white/150 backdrop-blur-[1px] dark:bg-slate-900/70"
          />
        )}
      </div>

      <AddUserModal
        open={isInviteModalOpen}
        onCancel={() => setInviteModalOpen(false)}
      />
    </div>
  );
}