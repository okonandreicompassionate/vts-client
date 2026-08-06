import { Switch, Button } from "antd";
import Form, { useForm } from "antd/es/form/Form";
import FormItem from "antd/es/form/FormItem";
import CustomModal from "../../../../components/custom-modal";
import { usePopup } from "../../../../hooks/use-popup";

const toggleRows = [
  { name: "checkInAlerts", label: "Email alerts for new visitor check-ins" },
  { name: "pendingApprovalAlerts", label: "Email alerts for pending approvals" },
  { name: "dailySummary", label: "Daily summary report" },
  
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
    <CustomModal onCancel={handleCancel} width={400}>
      <CustomModal.Header title="Notification Preferences" />
      <CustomModal.Body>
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
                <span className="text-sm font-medium text-slate-700">{row.label}</span>
                <FormItem name={row.name} valuePropName="checked" noStyle>
                  <Switch />
                </FormItem>
              </div>
            ))}
          </div>
        </Form>
      </CustomModal.Body>
      <CustomModal.Footer>
        <div className="mt-4 flex w-full items-center gap-3">
          <Button
            onClick={handleCancel}
            className="h-11! flex-1! rounded-full! border-slate-100! bg-slate-50! px-8! font-medium! text-slate-400! hover:bg-slate-100! hover:text-slate-500!"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleSavePreferences}
            className="h-11! flex-1! rounded-full! border-none! bg-sky-500! px-8! font-semibold! hover:bg-sky-600!"
          >
            Save Preferences
          </Button>
        </div>
      </CustomModal.Footer>
    </CustomModal>
  );
}

export default NotificationPreferencesModal;
