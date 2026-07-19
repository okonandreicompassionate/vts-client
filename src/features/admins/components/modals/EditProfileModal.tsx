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
      onOk={handleSaveChanges}
      onCancel={handleCancel}
      width={400}
    >
      <Form form={form} className="space-y-2 mt-4" layout="vertical">
        <FormItem
          label="Full Name"
          name="fullName"
          rules={[{ required: true, message: "Please enter your full name" }]}
        >
          <Input type="text" className="rounded-lg" placeholder="Enter your full name" />
        </FormItem>

        <FormItem
          label="Email Address"
          name="email"
          rules={[
            { required: true, message: "Please enter your email address" },
            { type: "email", message: "Please enter a valid email address" },
          ]}
        >
          <Input type="email" className="rounded-lg" placeholder="Enter your email address" />
        </FormItem>

        <FormItem
          label="Phone Number"
          name="phone"
          rules={[{ required: true, message: "Please enter your phone number" }]}
        >
          <Input type="text" className="rounded-lg" placeholder="Enter your phone number" />
        </FormItem>
      </Form>
    </CustomModal>
  );
}

export default EditProfileModal;