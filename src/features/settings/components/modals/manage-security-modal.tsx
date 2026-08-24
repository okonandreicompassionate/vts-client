import { Button, Input, message } from "antd";
import Form, { useForm } from "antd/es/form/Form";
import FormItem from "antd/es/form/FormItem";
import CustomModal from "../../../../components/ui/custom-modal";
import { usePopup } from "@/lib/contexts/popup/use-popup";
import { useUpdatePasswordMutation } from "../../api/settings-api-slice";

function ManageSecurityModal() {
  const [form] = useForm();
  const { closeModal } = usePopup();
  const [updatePassword] = useUpdatePasswordMutation();

  const handleSaveChanges = async () => {
    try {
      const values = await form.validateFields();
      await updatePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }).unwrap();
      message.success("Password updated successfully.");
      form.resetFields();
      closeModal();
    } catch {
      message.error("Unable to update password. Please try again.");
    }
  };

  const handleCancel = () => {
    form.resetFields();
    closeModal();
  };

  return (
    <CustomModal width={400} onCancel={handleCancel}>
      <CustomModal.Header title=" CHANGE PASSWORD" />

      <CustomModal.Body>
        <Form
          form={form}
          className="space-y-1 mt-2"
          layout="vertical"
          requiredMark={false}
          initialValues={{ twoFactorEnabled: true }}
        >
          <FormItem
            label={<span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Current Password</span>}
            name="currentPassword"
            rules={[{ required: true, message: "Please enter your current password" }]}
          >
            <Input.Password
              className="h-9! rounded-lg! border-slate-100! bg-[#F5FBFE]! px-4! text-[12px]! placeholder:text-slate-400! dark:border-slate-600! dark:bg-slate-800! dark:text-slate-100! dark:placeholder:text-slate-300!"
              placeholder="Enter current password"
            />
          </FormItem>

          <FormItem
            label={<span className="text-xs font-semibold text-slate-800 dark:text-slate-200">New Password</span>}
            name="newPassword"
            rules={[
              { required: true, message: "Please enter a new password" },
              { min: 8, message: "Password must be at least 8 characters" },
            ]}
          >
            <Input.Password
              className="h-9! rounded-lg! border-slate-100! bg-[#F5FBFE]! px-4! text-[12px]! placeholder:text-slate-400! dark:border-slate-600! dark:bg-slate-800! dark:text-slate-100! dark:placeholder:text-slate-300!"
              placeholder="Enter new password"
            />
          </FormItem>

          <FormItem
            label={
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Confirm New Password</span>
            }
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
            <Input.Password
              className="h-9! rounded-lg! border-slate-100! bg-[#F5FBFE]! px-4! text-[12px]! placeholder:text-slate-400! dark:border-slate-600! dark:bg-slate-800! dark:text-slate-100! dark:placeholder:text-slate-300!"
              placeholder="Re-enter new password"
            />
          </FormItem>
        </Form>
      </CustomModal.Body>

      <CustomModal.Footer>
        <div className="mt-4 flex w-full items-center gap-3">
          <Button
            onClick={handleCancel}
            className="h-9! flex-1! rounded-full! border-slate-200! bg-white! px-8! text-xs font-medium! text-slate-500 hover:bg-slate-50! hover:text-slate-600! dark:border-slate-600! dark:bg-slate-700! dark:text-slate-300! dark:hover:bg-slate-600! dark:hover:text-slate-100!"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleSaveChanges}
            className="h-9! flex-1! rounded-full! border-none! bg-sky-500! px-8! text-xs font-semibold! hover:bg-sky-600!"
          >
            Update Password
          </Button>
        </div>
      </CustomModal.Footer>
    </CustomModal>
  );
}

export default ManageSecurityModal;
