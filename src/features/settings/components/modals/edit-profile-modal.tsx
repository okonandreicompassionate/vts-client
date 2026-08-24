import { Button, Input, message } from "antd";
import Form, { useForm } from "antd/es/form/Form";
import FormItem from "antd/es/form/FormItem";
import { useEffect } from "react";
import CustomModal from "../../../../components/ui/custom-modal";
import { usePopup } from "@/lib/contexts/popup/use-popup";
import { useGetProfileQuery, useUpdateProfileMutation } from "../../api/settings-api-slice";

function EditProfileModal() {
  const [form] = useForm();
  const { closeModal } = usePopup();
  const { data: profile } = useGetProfileQuery();
  const [updateProfile] = useUpdateProfileMutation();

  useEffect(() => {
    if (!profile) return;
    form.setFieldsValue({
      fullName: profile.fullName ?? "",
      email: profile.email ?? "",
      phoneNumber: profile.phoneNumber ?? "",
    });
  }, [profile, form]);

  const handleSaveChanges = async () => {
    try {
      const values = await form.validateFields();
      await updateProfile(values).unwrap();
      message.success("Profile updated successfully.");
      form.resetFields();
      closeModal();
    } catch {
      message.error("Unable to save profile changes. Please try again.");
    }
  };

  const handleCancel = () => {
    form.resetFields();
    closeModal();
  };

  return (
    <CustomModal width={400} onCancel={handleCancel}>
      <CustomModal.Header title="Edit Profile" />

      <CustomModal.Body>
        <Form form={form} className="mt-2 space-y-1" layout="vertical">
          <FormItem
            label={<span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Full Name</span>}
            name="fullName"
            rules={[{ required: true, message: "Please enter your full name" }]}
          >
            <Input
              type="text"
              className="h-11! rounded-lg! border-slate-100! bg-[#F5FBFE]! px-4! text-xs! placeholder:text-slate-400! dark:border-slate-600! dark:bg-slate-800! dark:text-slate-100! dark:placeholder:text-slate-300!"
              placeholder="Admin User"
            />
          </FormItem>

          <FormItem
            label={<span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Email Address</span>}
            name="email"
            rules={[
              { required: true, message: "Please enter your email address" },
              { type: "email", message: "Please enter a valid email address" },
            ]}
          >
            <Input
              type="email"
              className="h-11! rounded-lg! border-slate-100! bg-[#F5FBFE]! px-4! text-xs! placeholder:text-slate-400! dark:border-slate-600! dark:bg-slate-800! dark:text-slate-100! dark:placeholder:text-slate-300!"
              placeholder=""
            />
          </FormItem>

          <FormItem
            label={<span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Phone Number</span>}
            name="phoneNumber"
            rules={[{ required: true, message: "Please enter your phone number" }]}
          >
            <Input
              type="text"
              className="h-11! rounded-lg! border-slate-100! bg-[#F5FBFE]! px-4! text-xs! placeholder:text-slate-400! dark:border-slate-600! dark:bg-slate-800! dark:text-slate-100! dark:placeholder:text-slate-300!"
              placeholder="+234 801 234 5678"
            />
          </FormItem>
        </Form>
      </CustomModal.Body>

      <CustomModal.Footer>
        <div className="mt-4 flex w-full items-center gap-3">
          <Button
            onClick={handleCancel}
            className="h-11! flex-1! rounded-full! border-slate-100! bg-slate-50! px-8! font-medium! text-slate-400! hover:bg-slate-100! hover:text-slate-500! dark:border-slate-600! dark:bg-slate-700! dark:text-slate-200! dark:hover:bg-slate-600! dark:hover:text-slate-100!"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleSaveChanges}
            className="h-11! flex-1! rounded-full! border-none! bg-sky-500! px-8! font-semibold! hover:bg-sky-600!"
          >
            Save Changes
          </Button>
        </div>
      </CustomModal.Footer>
    </CustomModal>
  );
}

export default EditProfileModal;
