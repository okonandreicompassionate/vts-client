import { Button, Input, message } from "antd";
import Form, { useForm } from "antd/es/form/Form";
import FormItem from "antd/es/form/FormItem";
import { useEffect } from "react";

import CustomModal from "../../../../components/ui/custom-modal";
import { usePopup } from "@/lib/contexts/popup/use-popup";
import {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} from "../../api/settings-api-slice";

function SystemSettingsModal() {
  const [form] = useForm();
  const { closeModal } = usePopup();

  const {
    data: settings,
    isLoading: isLoadingSettings,
  } = useGetSettingsQuery();

  const [updateSettings, { isLoading: isSaving }] =
    useUpdateSettingsMutation();

  useEffect(() => {
    if (!settings) return;

    form.setFieldsValue({
      name: settings.name ?? "",
      slug: settings.slug ?? "",
      azureTenantId: settings.azureTenantId ?? "",
      badgePrefix: settings.visitorBadgePrefix ?? "",
      maxCapacity: settings.maxVisitorsPerDay?.toString() ?? "",
    });
  }, [settings, form]);

  const handleSaveSettings = async () => {
    try {
      const values = await form.validateFields();

      // Staff URLs don't include the slug, so renaming it needs no redirect.
      // Old visitor links keep working: the server remembers previous slugs.
      await updateSettings({
        name: values.name.trim(),
        slug: values.slug.trim().toLowerCase(),
        azureTenantId: values.azureTenantId?.trim() || undefined,
        maxVisitorsPerDay: values.maxCapacity
          ? Number(values.maxCapacity)
          : undefined,
        visitorBadgePrefix: values.badgePrefix?.trim() || undefined,
      }).unwrap();

      message.success("System settings updated successfully.");
      closeModal();
    } catch (error) {
      const data =
        error && typeof error === "object" && "data" in error
          ? (error.data as { message?: string | string[] } | undefined)
          : undefined;
      const serverMessage = Array.isArray(data?.message)
        ? data.message.join(", ")
        : data?.message;

      message.error(serverMessage ?? "Unable to save system settings. Please try again.");
    }
  };

  const handleCancel = () => {
    form.resetFields();
    closeModal();
  };

  return (
    <CustomModal>
      <CustomModal.Header title="System Settings" />

      <CustomModal.Body loading={isLoadingSettings}>
        <Form
          form={form}
          className="mt-2 space-y-1"
          layout="vertical"
          requiredMark={false}
        >
          <FormItem
            label={
              <span className="text-[14px] font-semibold text-slate-800 dark:text-slate-200">
                Organization Name
              </span>
            }
            name="name"
            rules={[
              {
                required: true,
                message: "Please enter the organization name",
              },
            ]}
          >
            <Input
              className="h-9! rounded-lg! border-slate-100! bg-slate-50! px-4! dark:border-slate-600! dark:bg-slate-800! dark:text-slate-100!"
              placeholder="Organization name"
            />
          </FormItem>

          <FormItem
            label={
              <span className="text-[14px] font-semibold text-slate-800 dark:text-slate-200">
                Visitor Link Slug
              </span>
            }
            name="slug"
            extra="Used in the link and QR code visitors open. Previous links keep working after a change."
            rules={[
              {
                required: true,
                message: "Please enter the organization slug",
              },
              {
                pattern: /^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/,
                message: "3-63 lowercase letters, numbers and hyphens.",
              },
            ]}
          >
            <Input
              className="h-9! rounded-lg! border-slate-100! bg-slate-50! px-4! dark:border-slate-600! dark:bg-slate-800! dark:text-slate-100!"
              placeholder="e.g. zoracom"
            />
          </FormItem>

          {settings?.authMode === "AZURE_AD" && (
            <FormItem
              label={
                <span className="text-[14px] font-semibold text-slate-800 dark:text-slate-200">
                  Microsoft Directory (Tenant) ID
                </span>
              }
              name="azureTenantId"
              extra="Staff can only sign in with Microsoft accounts from this directory. Set automatically on the first Microsoft sign-in if left empty."
              rules={[
                {
                  pattern: /^[0-9a-fA-F-]{36}$/,
                  message: "Enter the directory ID (a GUID) from the Microsoft Entra admin center.",
                },
              ]}
            >
              <Input
                className="h-9! rounded-lg! border-slate-100! bg-slate-50! px-4! dark:border-slate-600! dark:bg-slate-800! dark:text-slate-100!"
                placeholder="00000000-0000-0000-0000-000000000000"
              />
            </FormItem>
          )}

          <FormItem
            label={
              <span className="text-[14px] font-semibold text-slate-800 dark:text-slate-200">
                Visitor Badge Prefix
              </span>
            }
            name="badgePrefix"
          >
            <Input
              className="h-9! rounded-lg! border-slate-100! bg-slate-50! px-4! dark:border-slate-600! dark:bg-slate-800! dark:text-slate-100!"
              placeholder="e.g. ZOR"
            />
          </FormItem>

          <FormItem
            label={
              <span className="text-[14px] font-semibold text-slate-800 dark:text-slate-200">
                Max Visitor Capacity Per Day
              </span>
            }
            name="maxCapacity"
            rules={[
              {
                required: true,
                message: "Please enter the max capacity",
              },
            ]}
          >
            <Input
              type="number"
              min={1}
              className="h-9! rounded-lg! border-slate-100! bg-slate-50! px-4! dark:border-slate-600! dark:bg-slate-800! dark:text-slate-100!"
              placeholder="Enter max capacity"
            />
          </FormItem>
        </Form>
      </CustomModal.Body>

      <CustomModal.Footer>
        <div className="mt-4 flex w-full items-center gap-3">
          <Button
            onClick={handleCancel}
            className="h-9! flex-1! rounded-full! border-slate-200! bg-white! px-8! font-medium! dark:border-slate-600! dark:bg-slate-700! dark:text-slate-200!"
          >
            Cancel
          </Button>

          <Button
            type="primary"
            onClick={handleSaveSettings}
            loading={isSaving}
            className="h-9! flex-1! rounded-full! border-none! bg-sky-500! px-8! font-semibold!"
          >
            Save Settings
          </Button>
        </div>
      </CustomModal.Footer>
    </CustomModal>
  );
}

export default SystemSettingsModal;