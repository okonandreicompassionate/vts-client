import { Input, Switch } from "antd";
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
    <CustomModal
      title="Manage Security"
      okText="Update Password"
      onOk={handleSaveChanges}
      onCancel={handleCancel}
      width={400}
    >
      <p className="text-[11px] font-bold tracking-wide text-slate-400 mb-3 mt-4">
        CHANGE PASSWORD
      </p>

      <Form
        form={form}
        className="space-y-2"
        layout="vertical"
        initialValues={{ twoFactorEnabled: true }}
      >
        <FormItem
          label="Current Password"
          name="currentPassword"
          rules={[{ required: true, message: "Please enter your current password" }]}
        >
          <Input.Password className="rounded-lg" placeholder="Enter current password" />
        </FormItem>

        <FormItem
          label="New Password"
          name="newPassword"
          rules={[
            { required: true, message: "Please enter a new password" },
            { min: 8, message: "Password must be at least 8 characters" },
          ]}
        >
          <Input.Password className="rounded-lg" placeholder="Enter new password" />
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
          <Input.Password className="rounded-lg" placeholder="Re-enter new password" />
        </FormItem>

        <div className="flex items-center justify-between mt-5 mb-2">
          <div className="pr-4">
            <p className="text-sm font-bold text-slate-800 leading-tight">
              Two-Factor Authentication
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Add an extra layer of security to your account
            </p>
          </div>
          <FormItem name="twoFactorEnabled" valuePropName="checked" noStyle>
            <Switch />
          </FormItem>
        </div>
      </Form>
    </CustomModal>
  );
}

export default ManageSecurityModal;