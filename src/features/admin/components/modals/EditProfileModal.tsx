import { Input } from "antd";
import Form, { useForm } from "antd/es/form/Form";
import FormItem from "antd/es/form/FormItem";
import CustomModal from "../../../../global/CustomModal";

function EditProfileModal() {
  const [form] = useForm();

  const handleSaveChanges = async () => {
    const values = await form.validateFields();

    try {
      console.log(values);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <CustomModal
        title={ "Edit Profile"}
        okText={"Save Changes"}
        onOk={handleSaveChanges}
        onCancel={() => {}}
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
            ]}
          >
            <Input type="email" className="rounded-lg" placeholder="Enter your email address" />
          </FormItem>

          <FormItem
            label="Phone Number"
            name="phone"
            rules={[
              { required: true, message: "Please enter your phone number" },
            ]}
          >
            <Input type="text" className="rounded-lg" placeholder="Enter your phone number" />
          </FormItem>
        </Form>
      </CustomModal>
    </div>
  );
}

export default EditProfileModal;
