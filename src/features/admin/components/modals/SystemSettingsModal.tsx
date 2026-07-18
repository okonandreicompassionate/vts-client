import { Input } from "antd";
import Form, { useForm } from "antd/es/form/Form";
import FormItem from "antd/es/form/FormItem";
import CustomModal from "../../../../components/CustomModal";
import { usePopup } from "../../../../hooks/usePopup";

function SystemSettingsModal() {
  const [form] = useForm();
  const { closeModal } = usePopup();

  const handleSaveSettings = async () => {
    try {
      const values = await form.validateFields();
      console.log(values);
      // TODO: persist system settings here
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
      title="System Settings"
      okText="Save Settings"
      onOk={handleSaveSettings}
      onCancel={handleCancel}
      width={400}
    >
      <Form
        form={form}
        className="space-y-2 mt-4"
        layout="vertical"
        initialValues={{
          companyName: "Zoracom",
          badgePrefix: "ZOR-",
          maxCapacity: "250",
        }}
      >
        <FormItem
          label="Company Name"
          name="companyName"
          rules={[{ required: true, message: "Please enter the company name" }]}
        >
          <Input type="text" className="rounded-lg" placeholder="Enter company name" />
        </FormItem>

        <FormItem
          label="Visitor Badge Prefix"
          name="badgePrefix"
          rules={[{ required: true, message: "Please enter a badge prefix" }]}
        >
          <Input type="text" className="rounded-lg" placeholder="e.g. ZOR-" />
        </FormItem>

        <FormItem
          label="Max Visitor Capacity Per Day"
          name="maxCapacity"
          rules={[{ required: true, message: "Please enter the max capacity" }]}
        >
          <Input type="text" className="rounded-lg" placeholder="Enter max capacity" />
        </FormItem>
      </Form>
    </CustomModal>
  );
}

export default SystemSettingsModal;