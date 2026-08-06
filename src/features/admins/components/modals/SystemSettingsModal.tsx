import { Input, Button, message } from "antd";
import Form, { useForm } from "antd/es/form/Form";
import FormItem from "antd/es/form/FormItem";
import CustomModal from "../../../../components/CustomModal";
import { useEffect } from "react";
import { usePopup } from "../../../../hooks/usePopup";
import { useGetProfileQuery, useUpdateSettingsMutation } from "../../api/admin-api-slice";

function SystemSettingsModal() {
  const [form] = useForm();
  const { closeModal } = usePopup();
  const { data: profile } = useGetProfileQuery();
  const [updateSettings, { isLoading: isSaving }] = useUpdateSettingsMutation();

  useEffect(() => {
    if (!profile) return;
    form.setFieldsValue({
      slug: profile.organization?.slug ?? "",
      badgePrefix: profile.organization?.visitorBadgePrefix ?? "",
      maxCapacity: profile.organization?.maxVisitorsPerDay?.toString() ?? "",
    });
  }, [profile, form]);

  const handleSaveSettings = async () => {
    try {
      const values = await form.validateFields();
      await updateSettings({
        slug: values.slug ? values.slug.toString().trim() : undefined,
        maxVisitorsPerDay: values.maxCapacity ? Number(values.maxCapacity) : undefined,
        visitorBadgePrefix: values.badgePrefix?.toString().trim(),
      }).unwrap();
      message.success("System settings updated successfully.");
      closeModal();
    } catch {
      message.error("Unable to save system settings. Please try again.");
    }
  };

  const handleCancel = () => {
    form.resetFields();
    closeModal();
  };

  return (
    <CustomModal onCancel={handleCancel} width={400}>
      <CustomModal.Header title="System Settings" />
      <CustomModal.Body>
        <Form
          form={form}
          className="mt-4 space-y-1"
          layout="vertical"
          requiredMark={false}
          initialValues={{
            slug: "",
            badgePrefix: "",
            maxCapacity: "",
          }}
        >
          <FormItem
            label={
              <span className="text-[14px] font-semibold text-slate-800">Organization Slug</span>
            }
            name="slug"
            rules={[{ required: true, message: "Please enter the organization slug" }]}
          >
            <Input
              type="text"
              className="h-11! rounded-lg! border-slate-100! bg-slate-50! px-4! text-[14px]! placeholder:text-slate-400! dark:placeholder:text-slate-300!"
              placeholder="acme-corp-hq"
            />
          </FormItem>

          <FormItem
            label={
              <span className="text-[14px] font-semibold text-slate-800">Visitor Badge Prefix</span>
            }
            name="badgePrefix"
            rules={[{ required: true, message: "Please enter a badge prefix" }]}
          >
            <Input
              type="text"
              className="h-11! rounded-lg! border-slate-100! bg-slate-50! px-4! text-[14px]! placeholder:text-slate-400! dark:placeholder:text-slate-300!"
              placeholder="e.g. ZOR-"
            />
          </FormItem>

          <FormItem
            label={
              <span className="text-[14px] font-semibold text-slate-800">
                Max Visitor Capacity Per Day
              </span>
            }
            name="maxCapacity"
            rules={[{ required: true, message: "Please enter the max capacity" }]}
          >
            <Input
              type="text"
              className="h-11! rounded-lg! border-slate-100! bg-slate-50! px-4! text-[14px]! placeholder:text-slate-400! dark:placeholder:text-slate-300!"
              placeholder="Enter max capacity"
            />
          </FormItem>
        </Form>
      </CustomModal.Body>
      <CustomModal.Footer>
        <div className="mt-4 flex w-full items-center gap-3">
          <Button
            onClick={handleCancel}
            className="h-11! flex-1! rounded-full! border-slate-200! bg-white! px-8! font-medium! text-slate-500! hover:bg-slate-50! hover:text-slate-600! dark:border-slate-600! dark:bg-slate-700! dark:text-slate-300! dark:hover:bg-slate-600! dark:hover:text-slate-100!"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleSaveSettings}
            loading={isSaving}
            className="h-11! flex-1! rounded-full! border-none! bg-sky-500! px-8! font-semibold! hover:bg-sky-600!"
          >
            Save Settings
          </Button>
        </div>
      </CustomModal.Footer>
    </CustomModal>
  );
}

export default SystemSettingsModal;
