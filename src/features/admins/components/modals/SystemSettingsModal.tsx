import { Input, Button } from "antd";
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
      onCancel={handleCancel}
      width={400}
    >
      <CustomModal.Header title="System Settings" />
      <CustomModal.Body>
        <Form
        form={form}
        className="space-y-1 mt-4"
        layout="vertical"
        requiredMark={false}
        initialValues={{
          companyName: "Zoracom",
          badgePrefix: "ZOR-",
          maxCapacity: "250",
        }}
      >
        <FormItem
          label={<span className="text-slate-800 font-semibold text-[14px]">Company Name</span>}
          name="companyName"
          rules={[{ required: true, message: "Please enter the company name" }]}
        >
          <Input
            type="text"
            className="!rounded-lg !bg-slate-50 !border-slate-100 !h-11 !px-4 !text-[14px] placeholder:!text-slate-400"
            placeholder="Enter company name"
          />
        </FormItem>

        <FormItem
          label={
            <span className="text-slate-800 font-semibold text-[14px]">Visitor Badge Prefix</span>
          }
          name="badgePrefix"
          rules={[{ required: true, message: "Please enter a badge prefix" }]}
        >
          <Input
            type="text"
            className="!rounded-lg !bg-slate-50 !border-slate-100 !h-11 !px-4 !text-[14px] placeholder:!text-slate-400"
            placeholder="e.g. ZOR-"
          />
        </FormItem>

        <FormItem
          label={
            <span className="text-slate-800 font-semibold text-[14px]">
              Max Visitor Capacity Per Day
            </span>
          }
          name="maxCapacity"
          rules={[{ required: true, message: "Please enter the max capacity" }]}
        >
          <Input
            type="text"
            className="!rounded-lg !bg-slate-50 !border-slate-100 !h-11 !px-4 !text-[14px] placeholder:!text-slate-400"
            placeholder="Enter max capacity"
          />
        </FormItem>
      </Form>
      </CustomModal.Body>
      <CustomModal.Footer>
        <div className="mt-4 flex w-full items-center gap-3">
          <Button
            onClick={handleCancel}
            className="!rounded-full !h-11 !px-8 !bg-white !text-slate-500 !border-slate-200 hover:!bg-slate-50 hover:!text-slate-600 !font-medium !flex-1"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleSaveSettings}
            className="!rounded-full !h-11 !px-8 !bg-sky-500 hover:!bg-sky-600 !border-none !font-semibold !flex-1"
          >
            Save Settings
          </Button>
        </div>
      </CustomModal.Footer>
    </CustomModal>
  );
}

export default SystemSettingsModal;