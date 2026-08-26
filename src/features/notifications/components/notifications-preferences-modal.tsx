import { Button, Switch } from "antd";
import Form, { useForm } from "antd/es/form/Form";
import FormItem from "antd/es/form/FormItem";
import { useEffect } from "react";

import CustomModal from "@/components/ui/custom-modal";
import { usePopup } from "@/features/popup/hooks/use-popup";

import {
  useGetNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
} from "../api/notifications-api-slice";

const toggleRows = [
  {
    name: "notifyPendingVisitEmail",
    label: "Email alerts for pending visitor approvals",
  },
  {
    name: "dailySummaryEmailReport",
    label: "Daily summary report",
  },
] as const;

function NotificationPreferencesModal() {
  const [form] = useForm();
  const { closeModal } = usePopup();

  const {
    data: notificationSettings,
    isLoading: isLoadingSettings,
  } = useGetNotificationSettingsQuery();

  const [updateNotificationSettings, { isLoading: isUpdating }] =
    useUpdateNotificationSettingsMutation();

  const handleSavePreferences = async () => {
    try {
      const values = await form.validateFields();

      await updateNotificationSettings({
        notifyPendingVisitEmail: values.notifyPendingVisitEmail,
        dailySummaryEmailReport: values.dailySummaryEmailReport,
      }).unwrap();

      closeModal();
    } catch (error) {
      console.error("Failed to update notification preferences:", error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    closeModal();
  };

  useEffect(() => {
    if (!notificationSettings) return;

    form.setFieldsValue({
      notifyPendingVisitEmail:
        notificationSettings.notifyPendingVisitEmail,
      dailySummaryEmailReport:
        notificationSettings.dailySummaryEmailReport,
    });
  }, [notificationSettings, form]);

  return (
    <CustomModal onCancel={handleCancel} width={400}>
      <CustomModal.Header title="Notification Preferences" />

      <CustomModal.Body loading={isLoadingSettings}>
        <Form
          form={form}
          className="mt-4"
          layout="vertical"
          initialValues={{
            notifyPendingVisitEmail:
              notificationSettings?.notifyPendingVisitEmail ?? false,
            dailySummaryEmailReport:
              notificationSettings?.dailySummaryEmailReport ?? true,
          }}
        >
          <div className="space-y-4">
            {toggleRows.map((row) => (
              <div
                key={row.name}
                className="flex items-center justify-between"
              >
                <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
                  {row.label}
                </span>

                <FormItem
                  name={row.name}
                  valuePropName="checked"
                  noStyle
                >
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
            disabled={isUpdating || isLoadingSettings}
            className="h-11! flex-1! rounded-full! border-slate-100! bg-slate-50! px-8! font-medium! text-slate-400! hover:bg-slate-100! hover:text-slate-500! dark:border-slate-600! dark:bg-slate-700! dark:text-slate-200! dark:hover:bg-slate-600! dark:hover:text-slate-100!"
          >
            Cancel
          </Button>

          <Button
            type="primary"
            onClick={handleSavePreferences}
            loading={isUpdating}
            disabled={isLoadingSettings}
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