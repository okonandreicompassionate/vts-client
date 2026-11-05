import { Input, message } from "antd";
import Form, { useForm } from "antd/es/form/Form";
import FormItem from "antd/es/form/FormItem";
import CustomModal from "@/components/ui/custom-modal";
import { usePopup } from "@/lib/contexts/popup/use-popup";
import { useUpdatePasswordMutation } from "../../api/settings-api-slice";
import { getApiErrorMessage } from "@/utils/api-error";
import { useLogout } from "@/features/auth/hooks/use-logout";

function ManageSecurityModal() {
  const [form] = useForm();
  const { closeModal } = usePopup();
  const [updatePassword, { isLoading: isSaving }] = useUpdatePasswordMutation();
  const logout = useLogout();

  const handleSaveChanges = async () => {
    let values: { currentPassword: string; newPassword: string };
    try {
      values = await form.validateFields();
    } catch {
      return; // The form shows what needs fixing.
    }

    try {
      await updatePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }).unwrap();
      message.success("Password updated. Please sign in again.");
      form.resetFields();
      closeModal();
      await logout();
    } catch (error) {
      // e.g. "Current password is incorrect."
      message.error(getApiErrorMessage(error, "Unable to update password. Please try again."));
    }
  };

  return (
    <CustomModal size="sm" onCancel={() => form.resetFields()} disableClose={isSaving}>
      <CustomModal.Header title="Change password" />

      <CustomModal.Body>
        <Form
          form={form}
          className="mt-2 space-y-1"
          layout="vertical"
          initialValues={{ twoFactorEnabled: true }}
        >
          <FormItem
            label="Current Password"
            name="currentPassword"
            rules={[{ required: true, message: "Please enter your current password" }]}
          >
            <Input.Password placeholder="Enter current password" />
          </FormItem>

          <FormItem
            label="New Password"
            name="newPassword"
            rules={[
              { required: true, message: "Please enter a new password" },
              { min: 8, message: "Password must be at least 8 characters" },
            ]}
          >
            <Input.Password placeholder="Enter new password" />
          </FormItem>

          <FormItem
            label="Confirm New Password"
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Please confirm your new password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Re-enter new password" />
          </FormItem>
        </Form>
      </CustomModal.Body>

      <CustomModal.Footer
        okText="Update password"
        loading={isSaving}
        onOk={() => void handleSaveChanges()}
      />
    </CustomModal>
  );
}

export default ManageSecurityModal;
