import CustomModal from "@/components/ui/custom-modal";
import { Button, Form, Input, Select, message } from "antd";
import type { InviteFormValues } from "../../types/types";
import { useCreateInviteMutation } from "../../api/admins-api-slice";

interface AddUserModalProps {
  open: boolean;
  onCancel: () => void;
}

export default function AddUserModal({
  open,
  onCancel,
}: AddUserModalProps) {
  const [form] = Form.useForm<InviteFormValues>();

  const [createInvite, { isLoading: isSendingInvite }] =
    useCreateInviteMutation();

  const handleClose = () => {
    form.resetFields();
    onCancel();
  };

  const handleInviteSubmit = async (values: InviteFormValues) => {
    try {
      await createInvite({
        email: values.email.trim(),
        role: values.role,
      }).unwrap();

      message.success("Invite sent successfully.");

      form.resetFields();
      onCancel();
    } catch {
      message.error(
        "Unable to send the invite. Please check the email and role.",
      );
    }
  };

  return (
    <CustomModal
      open={open}
      width={420}
      onCancel={handleClose}
    >
      <CustomModal.Header
        title="Send Invite"
        subtitle="Add a new admin to this organization"
      />

      <CustomModal.Body maxHeight={false}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleInviteSubmit}
          className="mt-1 space-y-1"
        >
          <Form.Item
            label={
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Email
              </span>
            }
            name="email"
            rules={[
              {
                required: true,
                message: "Please enter an email address",
              },
              {
                type: "email",
                message: "Please enter a valid email address",
              },
            ]}
          >
            <Input
              placeholder="user@example.com"
              className="h-8! rounded-lg! border-slate-100! bg-[#F5FBFE]! px-4! text-xs! placeholder:text-slate-400! dark:border-slate-600! dark:bg-slate-800! dark:text-slate-100! dark:placeholder:text-slate-300!"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Role
              </span>
            }
            name="role"
            initialValue="ADMIN"
            rules={[
              {
                required: true,
                message: "Please select a role",
              },
            ]}
          >
            <Select
              options={[
                {
                  label: "Admin",
                  value: "ADMIN",
                },
                {
                  label: "Super Admin",
                  value: "SUPERADMIN",
                },
              ]}
              className="h-8! w-full cursor-pointer"
              classNames={{
                popup: {
                  listItem: "employee-autocomplete-option",
                },
              }}
            />
          </Form.Item>
        </Form>
      </CustomModal.Body>

      <CustomModal.Footer>
        <div className="mt-4 flex w-full items-center gap-3">
          <Button
            onClick={handleClose}
            className="h-8! flex-1! rounded-full! border-slate-100! bg-slate-50! px-8! font-medium! text-slate-400! hover:bg-slate-100! hover:text-slate-500! dark:border-slate-600! dark:bg-slate-700! dark:text-slate-200! dark:hover:bg-slate-600! dark:hover:text-slate-100!"
          >
            Cancel
          </Button>

          <Button
            type="primary"
            loading={isSendingInvite}
            onClick={() => form.submit()}
            className="h-8! flex-1! rounded-full! border-none! bg-sky-500! px-8! font-semibold! hover:bg-sky-600!"
          >
            Send Invite
          </Button>
        </div>
      </CustomModal.Footer>
    </CustomModal>
  );
}