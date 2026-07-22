import { Input } from "antd";
import Form, { useForm } from "antd/es/form/Form";
import FormItem from "antd/es/form/FormItem";
import CustomModal from "../../../../components/CustomModal";
import { usePopup } from "../../../../hooks/usePopup";

function EditProfileModal() {
  const [form] = useForm();
  const { closeModal } = usePopup();

  const handleSaveChanges = async () => {
    try {
      const values = await form.validateFields();
      console.log(values);
      // TODO: call your update API here
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
      title="Edit Profile"
      okText="Save Changes"
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
          "!rounded-full !h-11 !px-8 !bg-slate-50 !text-slate-400 !border-slate-100 hover:!bg-slate-100 hover:!text-slate-500 !font-medium !flex-1",
      }}
    >
      <Form form={form} className="space-y-1 mt-2" layout="vertical">
        <FormItem
          label={<span className="text-slate-800 font-semibold text-[14px]">Full Name</span>}
          name="fullName"
          rules={[{ message: "Please enter your full name" }]}
        >
          <Input
            type="text"
            className="!rounded-lg !bg-[#F5FBFE] !border-slate-100 !h-11 !px-4 !text-[14px] placeholder:!text-slate-400"
            placeholder="Admin User"
          />
        </FormItem>

        <FormItem
          label={<span className="text-slate-800 font-semibold text-[14px]">Email Address</span>}
          name="email"
          rules={[
            {  message: "Please enter your email address" },
            { type: "email", message: "Please enter a valid email address" },
          ]}
        >
          <Input
            type="email"
            className="!rounded-lg !bg-[#F5FBFE] !border-slate-100 !h-11 !px-4 !text-[14px] placeholder:!text-slate-400"
            placeholder="admin@zoracom.com"
          />
        </FormItem>

        <FormItem
          label={<span className="text-slate-800 font-semibold text-[14px]">Phone Number</span>}
          name="phone"
          rules={[{  message: "Please enter your phone number" }]}
        >
          <Input
            type="text"
            className="!rounded-lg !bg-[#F5FBFE] !border-slate-100 !h-11 !px-4 !text-[14px] placeholder:!text-slate-400"
            placeholder="+234 801 234 5678"
          />
        </FormItem>
      </Form>
    </CustomModal>
  );
}

export default EditProfileModal;