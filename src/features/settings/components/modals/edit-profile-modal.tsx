import { Input, message } from "antd";
import Form, { useForm } from "antd/es/form/Form";
import FormItem from "antd/es/form/FormItem";
import { useEffect } from "react";
import CustomModal from "@/components/ui/custom-modal";
import { usePopup } from "@/lib/contexts/popup/use-popup";
import { useUpdateProfileMutation } from "../../api/settings-api-slice";
import { useGetProfileQuery } from "@/lib/auth/profile-api";
import { getApiErrorMessage } from "@/utils/api-error";
import { fullNameRules, splitFullName } from "@/utils/full-name";

function EditProfileModal() {
  const [form] = useForm();
  const { closeModal } = usePopup();
  const { data: profile } = useGetProfileQuery();
  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();

  useEffect(() => {
    if (!profile) return;
    form.setFieldsValue({
      fullName: profile.fullName ?? "",
      email: profile.email ?? "",
      phoneNumber: profile.phoneNumber ?? "",
    });
  }, [profile, form]);

  const handleSaveChanges = async () => {
    let values: { fullName: string; email: string; phoneNumber: string };
    try {
      values = await form.validateFields();
    } catch {
      return; // The form shows what needs fixing.
    }

    try {
      await updateProfile({
        ...splitFullName(values.fullName),
        email: values.email.trim(),
        phone: values.phoneNumber.trim(),
      }).unwrap();
      message.success("Profile updated successfully.");
      form.resetFields();
      closeModal();
    } catch (error) {
      message.error(getApiErrorMessage(error, "Unable to save profile changes. Please try again."));
    }
  };

  return (
    <CustomModal size="sm" onCancel={() => form.resetFields()} disableClose={isSaving}>
      <CustomModal.Header title="Edit profile" />

      <CustomModal.Body>
        <Form form={form} className="mt-2 space-y-1" layout="vertical">
          <FormItem label="Full Name" name="fullName" rules={fullNameRules}>
            <Input type="text" placeholder="Admin User" />
          </FormItem>

          <FormItem
            label="Email Address"
            name="email"
            rules={[
              { required: true, message: "Please enter your email address" },
              { type: "email", message: "Please enter a valid email address" },
            ]}
          >
            <Input type="email" placeholder="" />
          </FormItem>

          <FormItem
            label="Phone Number"
            name="phoneNumber"
            rules={[{ required: true, message: "Please enter your phone number" }]}
          >
            <Input type="text" placeholder="+234 801 234 5678" />
          </FormItem>
        </Form>
      </CustomModal.Body>

      <CustomModal.Footer
        okText="Save changes"
        loading={isSaving}
        onOk={() => void handleSaveChanges()}
      />
    </CustomModal>
  );
}

export default EditProfileModal;
