import { Input, Switch, message } from "antd";
import Form, { useForm } from "antd/es/form/Form";
import FormItem from "antd/es/form/FormItem";

import CustomModal from "@/components/ui/custom-modal";
import { usePopup } from "@/lib/contexts/popup/use-popup";
import { useGetSettingsQuery, useUpdateSettingsMutation } from "../../api/settings-api-slice";

function SystemSettingsModal() {
  const [form] = useForm();
  const { closeModal } = usePopup();

  const { data: settings, isLoading: isLoadingSettings } = useGetSettingsQuery();

  const [updateSettings, { isLoading: isSaving }] = useUpdateSettingsMutation();

  const initialValues = {
    name: settings?.name ?? "",
    slug: settings?.slug ?? "",
    azureTenantId: settings?.azureTenantId ?? "",
    badgePrefix: settings?.visitorBadgePrefix ?? "",
    maxCapacity: settings?.maxVisitorsPerDay?.toString() ?? "",
    requireVisitorEmailVerification: settings?.requireVisitorEmailVerification ?? true,
  };

  const handleSaveSettings = async () => {
    try {
      const values = await form.validateFields();

      // Staff URLs don't include the slug, so renaming it needs no redirect.
      // Old visitor links keep working: the server remembers previous slugs.
      await updateSettings({
        name: values.name.trim(),
        slug: values.slug.trim().toLowerCase(),
        azureTenantId: values.azureTenantId?.trim() || undefined,
        maxVisitorsPerDay: values.maxCapacity ? Number(values.maxCapacity) : undefined,
        visitorBadgePrefix: values.badgePrefix?.trim() || undefined,
        requireVisitorEmailVerification: values.requireVisitorEmailVerification,
      }).unwrap();

      message.success("System settings updated successfully.");
      closeModal();
    } catch (error) {
      const data =
        error && typeof error === "object" && "data" in error
          ? (error.data as { message?: string | string[] } | undefined)
          : undefined;
      const serverMessage = Array.isArray(data?.message) ? data.message.join(", ") : data?.message;

      message.error(serverMessage ?? "Unable to save system settings. Please try again.");
    }
  };

  return (
    <CustomModal onCancel={() => form.resetFields()} disableClose={isSaving}>
      <CustomModal.Header title="System settings" />

      <CustomModal.Body loading={isLoadingSettings}>
        <Form
          key={JSON.stringify(settings)}
          form={form}
          initialValues={initialValues}
          className="mt-2 space-y-1"
          layout="vertical"
        >
          <FormItem
            label="Require visitor email verification"
            name="requireVisitorEmailVerification"
            valuePropName="checked"
            extra="Visitors always enter their email first to find appointments and saved details. When on, an email code is required before lookup. When off, the code step is skipped."
          >
            <Switch checkedChildren="On" unCheckedChildren="Off" />
          </FormItem>
          <FormItem
            label="Organization Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please enter the organization name",
              },
            ]}
          >
            <Input placeholder="Organization name" />
          </FormItem>

          <FormItem
            label="Visitor Link Slug"
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
            <Input placeholder="e.g. zoracom" />
          </FormItem>

          {settings?.authMode === "AZURE_AD" && (
            <FormItem
              label="Microsoft Directory (Tenant) ID"
              name="azureTenantId"
              extra="Staff can only sign in with Microsoft accounts from this directory. Set automatically on the first Microsoft sign-in if left empty."
              rules={[
                {
                  pattern: /^[0-9a-fA-F-]{36}$/,
                  message: "Enter the directory ID (a GUID) from the Microsoft Entra admin center.",
                },
              ]}
            >
              <Input placeholder="00000000-0000-0000-0000-000000000000" />
            </FormItem>
          )}

          <FormItem label="Visitor Badge Prefix" name="badgePrefix">
            <Input placeholder="e.g. ZOR" />
          </FormItem>

          <FormItem
            label="Max Visitor Capacity Per Day"
            name="maxCapacity"
            rules={[
              {
                required: true,
                message: "Please enter the max capacity",
              },
            ]}
          >
            <Input type="number" min={1} placeholder="Enter max capacity" />
          </FormItem>
        </Form>
      </CustomModal.Body>

      <CustomModal.Footer
        okText="Save settings"
        loading={isSaving}
        disabled={isLoadingSettings || !settings}
        onOk={() => void handleSaveSettings()}
      />
    </CustomModal>
  );
}

export default SystemSettingsModal;
