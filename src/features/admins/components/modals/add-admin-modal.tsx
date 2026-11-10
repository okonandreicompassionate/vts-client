import CustomModal from "@/components/ui/custom-modal";
import { Form, Input, Select, message } from "antd";
import type { InviteFormValues } from "../../types/types";
import { useCreateInviteMutation } from "../../api/admins-api-slice";
import { usePopup } from "@/lib/contexts/popup/use-popup";
import { getApiErrorMessage } from "@/utils/api-error";

/** Invite form. Open with `openModal(<AddAdminModal />)`. */
export default function AddAdminModal() {
  const { closeModal } = usePopup();
  const [form] = Form.useForm<InviteFormValues>();

  const [createInvite, { isLoading: isSendingInvite }] = useCreateInviteMutation();

  const handleInviteSubmit = async (values: InviteFormValues) => {
    try {
      await createInvite({
        email: values.email.trim(),
        role: values.role,
      }).unwrap();

      message.success("Invite sent successfully.");

      closeModal();
    } catch (error) {
      message.error(getApiErrorMessage(error, "Unable to send the invite. Please try again."));
    }
  };

  return (
    <CustomModal size="sm">
      <CustomModal.Header title="Send invite" subtitle="Add a new admin to this organization" />

      <CustomModal.Body scroll={false}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleInviteSubmit}
          className="mt-1 space-y-1"
        >
          <Form.Item
            label="Email"
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
            <Input placeholder="admin@example.com" />
          </Form.Item>

          <Form.Item
            label="Role"
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
                  label: "Super Admin",
                  value: "SUPERADMIN",
                },
                {
                  label: "Facility",
                  value: "FACILITY",
                },
                {
                  label: "Security",
                  value: "SECURITY",
                },
                {
                  label: "Frontdesk",
                  value: "FRONTDESK",
                },
                {
                  label: "Admin",
                  value: "ADMIN",
                },
                {
                  label: "User",
                  value: "HOST",
                },
              ]}
              className="w-full"
              classNames={{
                popup: {
                  listItem: "employee-autocomplete-option",
                },
              }}
            />
          </Form.Item>
        </Form>
      </CustomModal.Body>

      <CustomModal.Footer
        okText="Send invite"
        loading={isSendingInvite}
        onOk={() => form.submit()}
      />
    </CustomModal>
  );
}
