import { Button, Input, Switch } from "antd";
import Form, { useForm } from "antd/es/form/Form";
import FormItem from "antd/es/form/FormItem";
import CustomModal from "../../../../components/CustomModal";
import { usePopup } from "../../../../hooks/usePopup";

function ManageSecurityModal() {
  const [form] = useForm();
  const { closeModal } = usePopup();

  const handleSaveChanges = async () => {
    try {
      const values = await form.validateFields();
      console.log(values);
      // TODO: call your update-password / 2FA API here
      form.resetFields();
      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    closeModal();
  };

  return (
    <CustomModal width={400} onCancel={handleCancel}>
      <CustomModal.Header title="Manage Security" />

      <CustomModal.Body>
        <p className="mt-4 mb-3 text-[11px] font-bold tracking-wide text-slate-400">
          CHANGE PASSWORD
        </p>

        <Form
          form={form}
          className="space-y-1"
          layout="vertical"
          requiredMark={false}
          initialValues={{ twoFactorEnabled: true }}
        >
          <FormItem
            label={
              <span className="text-[14px] font-semibold text-slate-800">Current Password</span>
            }
            name="currentPassword"
            rules={[{ required: true, message: "Please enter your current password" }]}
          >
            <Input.Password
              className="!h-11 !rounded-lg !border-slate-100 !bg-[#F5FBFE] !px-4 !text-[14px] placeholder:!text-slate-400"
              placeholder="Enter current password"
            />
          </FormItem>

          <FormItem
            label={<span className="text-[14px] font-semibold text-slate-800">New Password</span>}
            name="newPassword"
            rules={[
              { required: true, message: "Please enter a new password" },
              { min: 8, message: "Password must be at least 8 characters" },
            ]}
          >
            <Input.Password
              className="!h-11 !rounded-lg !border-slate-100 !bg-[#F5FBFE] !px-4 !text-[14px] placeholder:!text-slate-400"
              placeholder="Enter new password"
            />
          </FormItem>

          <FormItem
            label={
              <span className="text-[14px] font-semibold text-slate-800">Confirm New Password</span>
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
              className="!h-11 !rounded-lg !border-slate-100 !bg-[#F5FBFE] !px-4 !text-[14px] placeholder:!text-slate-400"
              placeholder="Re-enter new password"
            />
          </FormItem>

          <div className="mt-6 mb-2 flex items-center justify-between">
            <div className="pr-4">
              <p className="text-[14px] leading-tight font-bold text-slate-800">
                Two-Factor Authentication
              </p>
              <p className="mt-0.5 text-[12px] text-slate-400">
                Add an extra layer of security to your account
              </p>
            </div>
            <FormItem name="twoFactorEnabled" valuePropName="checked" noStyle>
              <Switch className="!bg-[#F5FBFE]" />
            </FormItem>
          </div>
        </Form>
      </CustomModal.Body>

      <CustomModal.Footer>
        <div className="mt-4 flex w-full items-center gap-3">
          <Button
            onClick={handleCancel}
            className="!h-11 !flex-1 !rounded-full !border-slate-200 !bg-white !px-8 !font-medium !text-slate-500 hover:!bg-slate-50 hover:!text-slate-600 dark:!border-slate-600 dark:!bg-slate-700 dark:!text-slate-300 dark:hover:!bg-slate-600 dark:hover:!text-slate-100"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleSaveChanges}
            className="!h-11 !flex-1 !rounded-full !border-none !bg-sky-500 !px-8 !font-semibold hover:!bg-sky-600"
          >
            Update Password
          </Button>
        </div>
      </CustomModal.Footer>
    </CustomModal>
  );
}

export default ManageSecurityModal;
