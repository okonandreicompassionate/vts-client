import { Button, Form, Input, message } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { usePopup } from "../../../hooks/usePopup";
import { ORG_SLUG } from "../../../lib/api";
import { useCreateVisitMutation } from "../api/create-visit-api";
import RegistrationModal from "../components/modals/RegistrationModal";
import RegistrationSuccessModal from "../components/modals/RegistrationSuccessModal";
import type { RegistrationValues } from "../types/registration-values";
import { paths } from "../../../config/paths";

export default function Registration() {
  const [form] = Form.useForm<RegistrationValues>();
  const { openModal } = usePopup();
  const [createVisit] = useCreateVisitMutation();

  const handleFinish = async (values: RegistrationValues) => {
    openModal(
      <RegistrationModal
        onSubmit={async () => {
          try {
            await createVisit({
              orgSlug: ORG_SLUG,
              fullName: values.name,
              email: values.email,
              phoneNumber: values.phoneNo,
              hostName: values.hostName,
              department: values.department,
              purposeOfVisit: values.purposeOfVisit,
            }).unwrap();

            window.localStorage.setItem(
              "visitorRegistration",
              JSON.stringify({ ...values, email: values.email, department: values.department }),
            );
            form.resetFields();
            openModal(
              <RegistrationSuccessModal
                onOk={() =>
                  window.location.assign(`${paths.visitorProfile.getHref()}?status=pending`)
                }
              />,
            );
          } catch {
            message.error("Registration could not be submitted. Please try again.");
          }
        }}
      />,
    );
  };

  return (
    <div className="flex w-full flex-col bg-white">
      <header className="jusify-between flex items-center border-b border-slate-200 px-5 py-4">
        <h1 className="text-lg font-bold text-slate-900">Registration</h1>
      </header>

      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={handleFinish}
        className="flex flex-1 flex-col px-5 pt-6 pb-4"
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please enter your name" }]}
        >
          <Input size="large" placeholder="" className="rounded-xl" />
        </Form.Item>

        <Form.Item
          name="purposeOfVisit"
          label="Purpose of Visit"
          rules={[{ required: true, message: "Please select a purpose" }]}
        >
          <Input size="large" placeholder="" className="rounded-xl" />
        </Form.Item>

        <Form.Item
          name="hostName"
          label="Host Name"
          rules={[{ required: true, message: "Please enter the host name" }]}
        >
          <Input size="large" className="rounded-xl" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email Address"
          rules={[
            { required: true, message: "Please enter your email address" },
            { type: "email", message: "Please enter a valid email address" },
          ]}
        >
          <Input size="large" type="email" className="rounded-xl" />
        </Form.Item>

        <Form.Item
          name="department"
          label="Department"
          rules={[{ required: true, message: "Please enter your department" }]}
        >
          <Input size="large" className="rounded-xl" />
        </Form.Item>

        <Form.Item
          name="phoneNo"
          label="Phone Number"
          rules={[
            { required: true, message: "Please enter your phone number" },
            { pattern: /^[0-9+\-\s]{7,15}$/, message: "Please enter a valid phone number" },
          ]}
        >
          <Input size="large" inputMode="tel" className="rounded-xl" />
        </Form.Item>

        <div className="flex-1" />

        <Form.Item className="mb-0">
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            className="rounded-lg text-[15px] font-semibold"
            icon={<ArrowRightOutlined />}
            iconPlacement="end"
          >
            Submit Registration
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}