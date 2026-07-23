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
      cancelText="Cancel"
      onOk={handleSaveChanges}
      onCancel={handleCancel}
      width={400}
      okButtonProps={{
        className:
          "!rounded-full !h-11 !px-8 !bg-sky-500 hover:!bg-sky-600 !border-none !font-semibold !flex-1",
      }}
      cancelButtonProps={{
        className:
          "!rounded-full !h-11 !px-8 !bg-white !text-slate-500 !border-slate-200 hover:!bg-slate-50 hover:!text-slate-600 !font-medium !flex-1",
      }}
    >
      <p className="text-[11px] font-bold tracking-wide text-slate-400 mb-3 mt-4">
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
            <span className="text-slate-800 font-semibold text-[14px]">
              Current Password
            </span>
          }
          name="currentPassword"
          rules={[{ required: true, message: "Please enter your current password" }]}
        >
          <Input.Password
            className="!rounded-lg !bg-[#F5FBFE] !border-slate-100 !h-11 !px-4 !text-[14px] placeholder:!text-slate-400"
            placeholder="Enter current password"
          />
        </FormItem>

        <FormItem
          label={
            <span className="text-slate-800 font-semibold text-[14px]">New Password</span>
          }
          name="newPassword"
          rules={[
            { required: true, message: "Please enter a new password" },
            { min: 8, message: "Password must be at least 8 characters" },
          ]}
        >
          <Input.Password
            className="!rounded-lg !bg-[#F5FBFE] !border-slate-100 !h-11 !px-4 !text-[14px] placeholder:!text-slate-400"
            placeholder="Enter new password"
          />
        </FormItem>

        <FormItem
          label={
            <span className="text-slate-800 font-semibold text-[14px]">
              Confirm New Password
            </span>
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
            className="!rounded-lg !bg-[#F5FBFE] !border-slate-100 !h-11 !px-4 !text-[14px] placeholder:!text-slate-400"
            placeholder="Re-enter new password"
          />
        </FormItem>

        <div className="flex items-center justify-between mt-6 mb-2">
          <div className="pr-4">
            <p className="text-[14px] font-bold text-slate-800 leading-tight">
              Two-Factor Authentication
            </p>
            <p className="text-[12px] text-slate-400 mt-0.5">
              Add an extra layer of security to your account
            </p>
          </div>
          <FormItem name="twoFactorEnabled" valuePropName="checked" noStyle>
            <Switch className="!bg-[#F5FBFE]" />
          </FormItem>
        </div>
      </Form>
    </CustomModal>
  );
}

export default ManageSecurityModal;