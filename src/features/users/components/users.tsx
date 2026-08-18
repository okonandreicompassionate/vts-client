import { useState } from "react";
import { Button, Form, Input, Select, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";

import AdminHeader from "@/app/routes/admin/layout/dashboard-header";
import { Avatar } from "@/components/ui/avatar";
import CustomModal from "@/components/ui/custom-modal";
import TableComponent from "@/components/ui/table";
import { paths } from "@/config/paths";
import { useCreateInviteMutation, useGetAdminsQuery } from "@/features/users/api/users-api-slice";
import type { AdminRole, AdminUserItem } from "@/features/users/types/api-types";
import { useTenant } from "@/lib/tenant";

type UserStatus = "active" | "disabled" | "invited";

type User = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  status: UserStatus;
};

type InviteFormValues = {
  email: string;
  role: AdminRole;
};

function EmployeeIdentityCell({ name, email }: { name: string; email?: string }) {
  return (
    <div className="flex items-center gap-2">
      <Avatar name={name} size="sm" />

      <div className="flex min-w-0 flex-col -space-y-0.5">
        <span className="truncate text-[12px] text-slate-800 dark:text-slate-100">{name}</span>
        {email && (
          <span className="truncate text-[11px] text-slate-500 dark:text-slate-400">{email}</span>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: UserStatus }) {
  const styles: Record<UserStatus, string> = {
    active: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
    disabled: "bg-slate-100 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400",
    invited: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  };

  const labels: Record<UserStatus, string> = {
    active: "Active",
    disabled: "Disabled",
    invited: "Invited",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border-0 px-2 py-0.5 text-[11px] font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

export default function UsersPage() {
  const [form] = Form.useForm<InviteFormValues>();
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);
  const navigate = useNavigate();
  const { orgSlug } = useTenant();

  const { data: admins = [], isLoading, refetch } = useGetAdminsQuery();
  const [createInvite, { isLoading: isSendingInvite }] = useCreateInviteMutation();

  const users: User[] = admins.map((admin: AdminUserItem) => ({
    id: admin.id,
    name: admin.fullName || admin.email,
    email: admin.email,
    role: admin.role,
    status: "active",
  }));

  const handleInvite = () => {
    setInviteModalOpen(true);
  };

  const handleInviteSubmit = async (values: InviteFormValues) => {
    try {
      await createInvite({
        email: values.email.trim(),
        role: values.role,
      }).unwrap();

      message.success("Invite sent successfully.");
      setInviteModalOpen(false);
      form.resetFields();
      await refetch();
    } catch {
      message.error("Unable to send the invite. Please check the email and role.");
    }
  };

  const columns: ColumnsType<User> = [
    {
      title: "Name",
      key: "name",
      render: (_value, record) => <EmployeeIdentityCell name={record.name} email={record.email} />,
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
      render: (status: UserStatus) => <StatusBadge status={status} />,
    },
  ];

  const handleRowClick = (record: User) => {
    navigate(paths.admin.userDetails.getHref(orgSlug, record.id));
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <AdminHeader title="Users" />

      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-3 dark:border-slate-800">
        <p className="text-[13px] text-slate-500 dark:text-slate-400">
          {users.length} {users.length === 1 ? "user" : "users"}
        </p>

        <Button
          size="small"
          type="primary"
          className="flex h-7 gap-1 text-[13px]"
          onClick={handleInvite}
        >
          <img src="/add-users.svg" alt="" className="h-3.5 w-3.5 text-white" />
          <span className="text-[13px]">Invite User</span>
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-auto px-6 py-4">
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-500 dark:text-slate-400">
            Loading admins...
          </div>
        ) : (
          <TableComponent<User>
            columns={columns}
            dataSource={users}
            rowKey="id"
            showSerialNumber
            serialNumberTitle="SN"
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
              style: { cursor: "pointer" },
            })}
          />
        )}
      </div>

      <CustomModal
        open={isInviteModalOpen}
        width={420}
        onCancel={() => {
          setInviteModalOpen(false);
          form.resetFields();
        }}
      >
        <CustomModal.Header title="Send Invite" subtitle="Add a new admin to this organization" />

        <CustomModal.Body maxHeight={false}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleInviteSubmit}
            className="mt-2 space-y-1"
          >
            <Form.Item
              label={<span className="text-xs font-semibold text-slate-800">Email</span>}
              name="email"
              rules={[
                { required: true, message: "Please enter an email address" },
                { type: "email", message: "Please enter a valid email address" },
              ]}
            >
              <Input
                placeholder="user@example.com"
                className="h-11! rounded-lg! border-slate-100! bg-[#F5FBFE]! px-4! text-xs! placeholder:text-slate-400!"
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-xs font-semibold text-slate-800">Role</span>}
              name="role"
              initialValue="ADMIN"
              rules={[{ required: true, message: "Please select a role" }]}
            >
              <Select
                options={[
                  { label: "Admin", value: "ADMIN" },
                  { label: "Super Admin", value: "SUPERADMIN" },
                ]}
                className="h-11!"
              />
            </Form.Item>
          </Form>
        </CustomModal.Body>

        <CustomModal.Footer>
          <div className="mt-4 flex w-full items-center gap-3">
            <Button
              onClick={() => {
                setInviteModalOpen(false);
                form.resetFields();
              }}
              className="h-11! flex-1! rounded-full! border-slate-100! bg-slate-50! px-8! font-medium! text-slate-400! hover:bg-slate-100! hover:text-slate-500!"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              loading={isSendingInvite}
              onClick={() => form.submit()}
              className="h-11! flex-1! rounded-full! border-none! bg-sky-500! px-8! font-semibold! hover:bg-sky-600!"
            >
              Send Invite
            </Button>
          </div>
        </CustomModal.Footer>
      </CustomModal>
    </div>
  );
}
