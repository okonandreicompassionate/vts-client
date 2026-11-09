import { Form, Switch, message } from "antd";

import CustomModal from "@/components/ui/custom-modal";
import { usePopup } from "@/lib/contexts/popup/use-popup";
import { getApiErrorMessage } from "@/utils/api-error";
import {
  useGetNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
} from "../api/notifications-api-slice";

interface NotificationPreferenceValues {
  notifyPendingVisitEmail: boolean;
  dailySummaryEmailReport: boolean;
}

const PREFERENCES: { name: keyof NotificationPreferenceValues; label: string }[] = [
  { name: "notifyPendingVisitEmail", label: "Email alerts for pending visitor approvals" },
  { name: "dailySummaryEmailReport", label: "Daily summary report" },
];

/** Open with `openModal(<NotificationPreferencesModal />)`. */
export default function NotificationPreferencesModal() {
  const [form] = Form.useForm<NotificationPreferenceValues>();
  const { closeModal } = usePopup();
  const { data: settings, isLoading: isLoadingSettings } = useGetNotificationSettingsQuery();
  const [updateSettings, { isLoading: isSaving }] = useUpdateNotificationSettingsMutation();

  const handleSave = async () => {
    const values = form.getFieldsValue();

    try {
      await updateSettings({
        notifyPendingVisitEmail: values.notifyPendingVisitEmail,
        dailySummaryEmailReport: values.dailySummaryEmailReport,
      }).unwrap();
      message.success("Notification preferences saved.");
      closeModal();
    } catch (error) {
      message.error(
        getApiErrorMessage(error, "Unable to save notification preferences. Please try again."),
      );
    }
  };

  return (
    <CustomModal size="sm" disableClose={isSaving}>
      <CustomModal.Header
        title="Notification preferences"
        subtitle="Choose which emails you receive."
      />

      {/* The form mounts once the settings are loaded, so its initial values are the saved ones. */}
      <CustomModal.Body loading={isLoadingSettings}>
        <Form<NotificationPreferenceValues>
          form={form}
          layout="vertical"
          initialValues={{
            notifyPendingVisitEmail: settings?.notifyPendingVisitEmail ?? false,
            dailySummaryEmailReport: settings?.dailySummaryEmailReport ?? true,
          }}
        >
          <div className="space-y-4">
            {PREFERENCES.map((preference) => (
              <div key={preference.name} className="flex items-center justify-between gap-4">
                <span className="text-xs font-medium text-slate-700 dark:text-zinc-200">
                  {preference.label}
                </span>
                <Form.Item name={preference.name} valuePropName="checked" noStyle>
                  <Switch />
                </Form.Item>
              </div>
            ))}
          </div>
        </Form>
      </CustomModal.Body>

      <CustomModal.Footer
        okText="Save preferences"
        loading={isSaving}
        disabled={isLoadingSettings}
        onOk={() => void handleSave()}
      />
    </CustomModal>
  );
}
