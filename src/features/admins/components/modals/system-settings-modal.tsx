import { Input, Button, message } from "antd";
import Form, { useForm } from "antd/es/form/Form";
import FormItem from "antd/es/form/FormItem";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import CustomModal from "../../../../components/custom-modal";
import { usePopup } from "../../../../hooks/use-popup";
import {
  useGetProfileQuery,
  useUpdateSettingsMutation,
} from "../../api/admin-api-slice";
import { switchTenantPath } from "@/lib/tenant";

function SystemSettingsModal() {
  const [form] = useForm();
  const { closeModal } = usePopup();

  const navigate = useNavigate();
  const location = useLocation();

  const { data: profile } = useGetProfileQuery();
  const [updateSettings, { isLoading: isSaving }] =
    useUpdateSettingsMutation();

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

      const newSlug = values.slug.toString().trim();
      const currentSlug = profile?.organization?.slug;

      await updateSettings({
        slug: newSlug,
        maxVisitorsPerDay: values.maxCapacity
          ? Number(values.maxCapacity)
          : undefined,
        visitorBadgePrefix: values.badgePrefix?.toString().trim(),
      }).unwrap();

      message.success("System settings updated successfully.");

      if (currentSlug && currentSlug !== newSlug) {
        navigate(switchTenantPath(location.pathname, newSlug), {
          replace: true,
        });
      }

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
    <CustomModal>
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
              <span className="text-[14px] font-semibold text-slate-800">
                Organization Slug
              </span>
            }
            name="slug"
            rules={[
              {
                required: true,
                message: "Please enter the organization slug",
              },
            ]}
          >
            <Input
              className="h-11! rounded-lg! border-slate-100! bg-slate-50! px-4!"
              placeholder="e.g. acme"
            />
          </FormItem>

          <FormItem
            label={
              <span className="text-[14px] font-semibold text-slate-800">
                Visitor Badge Prefix
              </span>
            }
            name="badgePrefix"
            rules={[
              {
                required: true,
                message: "Please enter a badge prefix",
              },
            ]}
          >
            <Input
              className="h-11! rounded-lg! border-slate-100! bg-slate-50! px-4!"
              placeholder="e.g. ACM-"
            />
          </FormItem>

          <FormItem
            label={
              <span className="text-[14px] font-semibold text-slate-800">
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
              className="h-11! rounded-lg! border-slate-100! bg-slate-50! px-4!"
              placeholder="Enter max capacity"
            />
          </FormItem>
        </Form>
      </CustomModal.Body>

      <CustomModal.Footer>
        <div className="mt-4 flex w-full items-center gap-3">
          <Button
            onClick={handleCancel}
            className="h-11! flex-1! rounded-full! border-slate-200! bg-white! px-8! font-medium!"
          >
            Cancel
          </Button>

          <Button
            type="primary"
            onClick={handleSaveSettings}
            loading={isSaving}
            className="h-11! flex-1! rounded-full! border-none! bg-sky-500! px-8! font-semibold!"
          >
            Save Settings
          </Button>
        </div>
      </CustomModal.Footer>
    </CustomModal>
  );
}

export default SystemSettingsModal;
