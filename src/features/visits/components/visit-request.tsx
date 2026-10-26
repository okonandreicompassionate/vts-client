import { Alert, Button, Form, Input, message, Select } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { usePopup } from "@/features/popup/hooks/use-popup";
import { useAppDispatch, useAppSelector } from "@/lib/stores/hooks";
import RegistrationModal from "./modals/visit-request-modal";
import RegistrationSuccessModal from "./modals/request-success-modal";
import type { RegistrationValues } from "../types/registration-values";
import { paths } from "../../../config/paths";
import { useOrganization } from "@/features/organizations";
import { setVisitorSession } from "../../auth/stores/visitor-auth-slice";
import {
  useCreateVisitMutation,
  useGetHostsQuery,
} from "../api/public-visits-api-slice";
import type { HostItem } from "../types/api-types";
import { getVisitActionErrorMessage } from "../utils/visits";

const PURPOSE_OF_VISIT_MAX_LENGTH = 60;

function splitFullName(fullName?: string | null) {
  const [firstName = "", ...lastNameParts] = fullName?.trim().split(/\s+/) ?? [];
  return { firstName, lastName: lastNameParts.join(" ") };
}

export default function Registration() {
  const { orgSlug } = useOrganization();
  const [form] = Form.useForm<RegistrationValues>();
  const { openModal, closeModal } = usePopup();
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const { visitorId, verifiedName, verifiedEmail, verifiedPhoneNumber } = useAppSelector(
    (state) => state.visitorAuth,
  );

  const [createVisit] = useCreateVisitMutation();

  const {
    data: hosts = [],
    isError: isHostsError,
    isLoading: isLoadingHosts,
  } = useGetHostsQuery();
  const selectableHosts = hosts.filter(
    (host): host is HostItem & { id: string; fullName: string } =>
      Boolean(host.id?.trim() && host.fullName?.trim()),
  );

  const purposeOfVisitValue = Form.useWatch("purposeOfVisit", form);

  const purposeOfVisitLength = purposeOfVisitValue?.length ?? 0;

  useEffect(() => {
    form.setFieldsValue({
      ...splitFullName(verifiedName),
      email: verifiedEmail ?? undefined,
      phoneNo: verifiedPhoneNumber ?? undefined,
    });
  }, [verifiedName, verifiedEmail, verifiedPhoneNumber, form]);

  const normalizeVisitStatus = (status?: string) => {
    const normalized = status?.toLowerCase().replace(/[_-]/g, " ").trim();

    if (normalized === "approved" || normalized === "signed in") {
      return "approved";
    }

    if (normalized === "rejected" || normalized === "declined") {
      return "rejected";
    }

    return "pending";
  };

  const handleFinish = async (values: RegistrationValues) => {
    const fullName = `${values.firstName.trim()} ${values.lastName.trim()}`.trim();
    const selectedHost = selectableHosts.find((host) => host.id === values.hostId);

    if (!selectedHost) {
      message.error("Please select a valid host and try again.");
      return;
    }

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
              visitorId: visitorId ?? undefined,
              firstName: values.firstName.trim(),
              lastName: values.lastName.trim(),
              email: values.email,
              phone: values.phoneNo,
              purpose: values.purposeOfVisit,
              hostId: selectedHost.id,
            }).unwrap();

            const createdAt = response?.createdAt ?? new Date().toISOString();

            const status = normalizeVisitStatus(response?.status);

            const visitId = response?.id ?? response?.referenceId;

            const requestId = response?.referenceId ?? response?.id;

            const resolvedVisitorId = response?.visitorId ?? visitorId;

            if (resolvedVisitorId) {
              dispatch(
                setVisitorSession({
                  visitorId: resolvedVisitorId,
                  fullName,
                  email: values.email,
                  phoneNumber: values.phoneNo,
                }),
              );
            }

            localStorage.setItem(
              "visitorRegistration",
              JSON.stringify({
                id: visitId,
                visitorId: resolvedVisitorId,
                name: fullName,
                email: values.email,
                phoneNo: values.phoneNo,
                hostName: selectedHost.fullName,
                purposeOfVisit: values.purposeOfVisit,
                status,
                requestId,
                createdAt,
              }),
            );

            form.resetFields();

            openModal(
              <RegistrationSuccessModal
                loading={false}
                onOk={() => navigate(paths.visitorProfile.getHref(orgSlug))}
              />,
            );
          } catch (error) {
            console.error("Registration failed:", error);

            closeModal();

            message.error(
              getVisitActionErrorMessage(
                error,
                "Registration could not be submitted. Please try again.",
              ),
            );
          }
        }}
      />,
    );
  };

  return (
    <div className="flex w-full flex-col items-center md:justify-center dark:bg-slate-900">
      <div className="flex w-full flex-1 flex-col md:max-w-lg md:flex-none md:overflow-y-auto">
        <header className="flex min-h-12 items-center justify-between border-b border-slate-200 ps-5 py-1 md:mt-0 dark:border-slate-700">
          <h1 className="text-md leading-normal font-bold whitespace-nowrap text-slate-900 dark:text-slate-100">
            Request a Visit
          </h1>
        </header>

        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          onFinish={handleFinish}
          className="flex flex-col px-5 pt-6 pb-28 md:flex-none md:pb-0 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/20"
        >
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true, whitespace: true, message: "Please enter your first name" }]}
          >
            <Input
              size="large"
              className="rounded-xl dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
            />
          </Form.Item>

          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, whitespace: true, message: "Please enter your last name" }]}
          >
            <Input
              size="large"
              className="rounded-xl dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
            />
          </Form.Item>

          <Form.Item
            name="purposeOfVisit"
            label="Purpose of Visit"
            rules={[
              { required: true, whitespace: true, message: "Please select a purpose" },
              {
                max: PURPOSE_OF_VISIT_MAX_LENGTH,
                message: `Purpose of visit can't exceed ${PURPOSE_OF_VISIT_MAX_LENGTH} characters`,
              },
            ]}
          >
            <Input
              size="large"
              maxLength={PURPOSE_OF_VISIT_MAX_LENGTH}
              className="rounded-xl dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
            />
          </Form.Item>

          <p className="-mt-2 mb-2 text-xs text-slate-400 dark:text-slate-500">
            Keep it brief, e.g. "Job interview" ({purposeOfVisitLength}/
            {PURPOSE_OF_VISIT_MAX_LENGTH})
          </p>

          <Form.Item
            name="hostId"
            label="Host Name"
            rules={[{ required: true, message: "Please select a host" }]}
          >
            <Select
              showSearch
              allowClear
              placeholder={
                isLoadingHosts
                  ? "Loading hosts..."
                  : isHostsError
                    ? "Hosts could not be loaded"
                    : "Select a host"
              }
              size="large"
              className="w-full"
              loading={isLoadingHosts}
              disabled={isHostsError || selectableHosts.length === 0}
              options={selectableHosts.map(({ id, fullName }) => ({
                value: id,
                label: fullName,
              }))}
              optionFilterProp="label"
              filterOption={(input, option) =>
                String(option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              notFoundContent={
                isLoadingHosts
                  ? "Loading hosts..."
                  : isHostsError
                    ? "Unable to load hosts"
                      : selectableHosts.length === 0
                        ? "No hosts with valid IDs available"
                        : "No hosts available"
              }
            />
          </Form.Item>
          {isHostsError && (
            <Alert
              className="mb-4"
              type="error"
              showIcon
              message="Hosts could not be loaded. Please refresh and try again."
            />
          )}

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

          <div className="fixed inset-x-0 bottom-0 z-20 bg-white px-5 pt-3 pb-[calc(env(safe-area-inset-bottom)+16px)] md:static md:border-0 md:bg-transparent md:px-0 md:pt-6 md:pb-0 dark:border-slate-700 dark:bg-slate-900">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              className="rounded-lg text-[13px] font-medium"
              icon={<ArrowRightOutlined />}
              iconPlacement="end"
            >
              Submit Request
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
