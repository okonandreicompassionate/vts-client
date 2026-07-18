import { Switch } from "antd";
import Form, { useForm } from "antd/es/form/Form";
import FormItem from "antd/es/form/FormItem";
import CustomModal from "../../../../components/CustomModal";
import { usePopup } from "../../../../hooks/usePopup";

const toggleRows = [
  { name: "checkInAlerts", label: "Email alerts for new visitor check-ins" },
  { name: "pendingApprovalAlerts", label: "Email alerts for pending approvals" },
  { name: "dailySummary", label: "Daily summary report" },
  { name: "vipSms", label: "SMS alerts for VIP guests" },
];

function NotificationPreferencesModal() {
  const [form] = useForm();
  const { closeModal } = usePopup();

  const handleSavePreferences = async () => {
    try {
      const values = await form.validateFields();
      console.log(values);
      // TODO: persist notification preferences here
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
      title="Notification Preferences"
      okText="Save Preferences"
      onOk={handleSavePreferences}
      onCancel={handleCancel}
      width={400}
    >
      <Form
        form={form}
        className="mt-4"
        layout="vertical"
        initialValues={{
          checkInAlerts: true,
          pendingApprovalAlerts: true,
          dailySummary: true,
          vipSms: false,
        }}
      >
        <div className="space-y-4">
          {toggleRows.map((row) => (
            <div key={row.name} className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">
                {row.label}
              </span>
              <FormItem name={row.name} valuePropName="checked" noStyle>
                <Switch />
              </FormItem>
            </div>
          ))}
        </div>
      </Form>
    </CustomModal>
  );
}

export default NotificationPreferencesModal;