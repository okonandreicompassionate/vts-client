import { Button, Form, Input, message } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { usePopup } from "../../../hooks/usePopup";
import { useCreateVisitMutation } from "../api/visit-api-slice";
import RegistrationModal from "../components/modals/RegistrationModal";
import RegistrationSuccessModal from "../components/modals/RegistrationSuccessModal";
import type { RegistrationValues } from "../types/registration-values";
import { paths } from "../../../config/paths";
import { useTenant } from "../../../lib/tenant";

export default function Registration() {
  const { orgSlug } = useTenant();
  const [form] = Form.useForm<RegistrationValues>();
  const { openModal, closeModal } = usePopup();
  const navigate = useNavigate();
  const [createVisit] = useCreateVisitMutation();

  const existingIdentity = useMemo(() => {
    if (typeof window === "undefined") return null;
    const stored = window.localStorage.getItem("visitorIdentity");
    if (!stored) return null;
    try {
      return JSON.parse(stored) as {
        name?: string;
        email?: string;
        phoneNo?: string;
      };
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!existingIdentity) return;
    form.setFieldsValue({
      name: existingIdentity.name ?? undefined,
      email: existingIdentity.email ?? undefined,
      phoneNo: existingIdentity.phoneNo ?? undefined,
    });
  }, [existingIdentity, form]);

  const normalizeVisitStatus = (status?: string) => {
    const normalized = status?.toLowerCase().replace(/[_-]/g, " ").trim();
    if (normalized === "approved" || normalized === "signed in") return "approved";
    if (normalized === "rejected" || normalized === "declined") return "rejected";
    return "pending";
  };

  const handleFinish = async (values: RegistrationValues) => {
    openModal(
      <RegistrationModal
        onSubmit={async () => {
          openModal(
            <RegistrationSuccessModal
              loading
              onOk={() => navigate(paths.visitorProfile.getHref(orgSlug))}
            />,
          );

          try {
            const response = await createVisit({
              fullName: values.name,
              email: values.email,
              phoneNumber: values.phoneNo,
              hostName: values.hostName,
              department: values.department,
              purposeOfVisit: values.purposeOfVisit,
            }).unwrap();

            const createdAt = response?.createdAt ?? new Date().toISOString();
            const status = normalizeVisitStatus(response?.status);
            const visitId = response?.id ?? response?.referenceId;
            const requestId = response?.referenceId ?? response?.id;
            const reason = response?.rejectionReason ?? response?.reason;

            window.localStorage.setItem(
              "visitorRegistration",
              JSON.stringify({
                id: visitId,
                ...values,
                email: values.email,
                status,
                requestId,
                createdAt,
                badgeNumber: response?.badgeNumber,
                reason,
              }),
            );

            form.resetFields();

            openModal(
              <RegistrationSuccessModal
                loading={false}
                onOk={() => navigate(paths.visitorProfile.getHref(orgSlug))}
              />,
            );
          } catch {
            closeModal();
            message.error("Registration could not be submitted. Please try again.");
          }
        }}
      />,
    );
  };

  return (
    <div className="flex w-full flex-col bg-white dark:bg-slate-900">
      <header className="jusify-between flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
        <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">Registration</h1>
      </header>

      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        initialValues={{
          name: existingIdentity?.name,
          email: existingIdentity?.email,
          phoneNo: existingIdentity?.phoneNo,
        }}
        onFinish={handleFinish}
        className="flex flex-1 flex-col px-5 pt-6 pb-4"
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please enter your name" }]}
        >
          <Input
            size="large"
            placeholder=""
            className="rounded-xl dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
          />
        </Form.Item>

        <Form.Item
          name="purposeOfVisit"
          label="Purpose of Visit"
          rules={[{ required: true, message: "Please select a purpose" }]}
        >
          <Input
            size="large"
            placeholder=""
            className="rounded-xl dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
          />
        </Form.Item>

        <Form.Item
          name="hostName"
          label="Host Name"
          rules={[{ required: true, message: "Please enter the host name" }]}
        >
          <Input
            size="large"
            className="rounded-xl dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
          />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email Address"
          rules={[
            { required: true, message: "Please enter your email address" },
            { type: "email", message: "Please enter a valid email address" },
          ]}
        >
          <Input
            size="large"
            type="email"
            className="rounded-xl dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
          />
        </Form.Item>

        <Form.Item
          name="department"
          label="Department"
          rules={[{ required: true, message: "Please enter your department" }]}
        >
          <Input
            size="large"
            className="rounded-xl dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
          />
        </Form.Item>

        <Form.Item
          name="phoneNo"
          label="Phone Number"
          rules={[
            { required: true, message: "Please enter your phone number" },
            { pattern: /^[0-9+\-\s]{7,15}$/, message: "Please enter a valid phone number" },
          ]}
        >
          <Input
            size="large"
            inputMode="tel"
            className="rounded-xl dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
          />
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
