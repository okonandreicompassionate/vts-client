import { AutoComplete, Button, Form, Input, message } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { usePopup } from "@/features/popup/hooks/use-popup";
import { useAppDispatch, useAppSelector } from "@/lib/stores/hooks";
import RegistrationModal from "./modals/registration-modal";
import RegistrationSuccessModal from "./modals/registration-success-modal";
import type { RegistrationValues } from "../types/registration-values";
import { paths } from "../../../config/paths";
import { useOrganization } from "@/features/organizations";
import { setVisitorSession } from "../../auth/stores/visitor-auth-slice";
import { useGetEmployeeNamesQuery } from "@/features/employees/api/public-employees-api-slice";
import { Spinner } from "@/components/ui/spinner";
import { useCreateVisitMutation } from "../api/public-visits-api-slice";

const PURPOSE_OF_VISIT_MAX_LENGTH = 60;

export default function Registration() {
  const { orgSlug } = useOrganization();
  const [form] = Form.useForm<RegistrationValues>();
  const { openModal, closeModal } = usePopup();
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const {
    visitorId,
    verifiedName,
    verifiedEmail,
    verifiedPhoneNumber,
  } = useAppSelector((state) => state.visitorAuth);

  const [createVisit] = useCreateVisitMutation();

  const {
    data: employeeNames = [],
    isLoading: isLoadingEmployeeNames,
  } = useGetEmployeeNamesQuery();

  const purposeOfVisitValue = Form.useWatch(
    "purposeOfVisit",
    form,
  );

  const purposeOfVisitLength =
    purposeOfVisitValue?.length ?? 0;

  useEffect(() => {
    form.setFieldsValue({
      name: verifiedName ?? undefined,
      email: verifiedEmail ?? undefined,
      phoneNo: verifiedPhoneNumber ?? undefined,
    });
  }, [
    verifiedName,
    verifiedEmail,
    verifiedPhoneNumber,
    form,
  ]);

  const normalizeVisitStatus = (status?: string) => {
    const normalized = status
      ?.toLowerCase()
      .replace(/[_-]/g, " ")
      .trim();

    if (
      normalized === "approved" ||
      normalized === "signed in"
    ) {
      return "approved";
    }

    if (
      normalized === "rejected" ||
      normalized === "declined"
    ) {
      return "rejected";
    }

    return "pending";
  };

  const handleFinish = async (
    values: RegistrationValues,
  ) => {
    openModal(
      <RegistrationModal
        onSubmit={async () => {
          openModal(
            <RegistrationSuccessModal
              loading
              onOk={() =>
                navigate(
                  paths.visitorProfile.getHref(orgSlug),
                )
              }
            />,
          );

          try {
            const response = await createVisit({
              visitorId: visitorId ?? undefined,
              fullName: values.name,
              email: values.email,
              phoneNumber: values.phoneNo,
              hostName: values.hostName,
              purposeOfVisit: values.purposeOfVisit,
            }).unwrap();

            const createdAt =
              response?.createdAt ??
              new Date().toISOString();

            const status = normalizeVisitStatus(
              response?.status,
            );

            const visitId =
              response?.id ??
              response?.referenceId;

            const requestId =
              response?.referenceId ??
              response?.id;

            const resolvedVisitorId =
              response?.visitorId ?? visitorId;

            if (resolvedVisitorId) {
              dispatch(
                setVisitorSession({
                  visitorId: resolvedVisitorId,
                  fullName: values.name,
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
                name: values.name,
                email: values.email,
                phoneNo: values.phoneNo,
                hostName: values.hostName,
                purposeOfVisit:
                  values.purposeOfVisit,
                status,
                requestId,
                createdAt,
              }),
            );

            form.resetFields();

            openModal(
              <RegistrationSuccessModal
                loading={false}
                onOk={() =>
                  navigate(
                    paths.visitorProfile.getHref(
                      orgSlug,
                    ),
                  )
                }
              />,
            );
          } catch (error) {
            console.error(
              "Registration failed:",
              error,
            );

            closeModal();

            message.error(
              "Registration could not be submitted. Please try again.",
            );
          }
        }}
      />,
    );
  };

  return (
    <div className="flex w-full flex-col items-center md:justify-center dark:bg-slate-900">
      <div className="flex w-full flex-1 flex-col md:max-w-lg md:flex-none md:overflow-y-auto">
        <header className="-mb-3 flex items-center justify-between border-b border-slate-200 px-5 md:mt-0 dark:border-slate-700">
          <h1 className="text-md font-bold text-slate-900 dark:text-slate-100">
            Registration
          </h1>
        </header>

        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          onFinish={handleFinish}
          className="flex flex-col px-5 pt-6 md:flex-none dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/20"
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[
              {
                required: true,
                message: "Please enter your name",
              },
            ]}
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
              {
                required: true,
                message: "Please select a purpose",
              },
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
            Keep it brief, e.g. "Job interview" (
            {purposeOfVisitLength}/
            {PURPOSE_OF_VISIT_MAX_LENGTH})
          </p>

          <Form.Item
            name="hostName"
            label="Host Name"
            rules={[
              {
                required: true,
                message: "Please enter the host name",
              },
            ]}
          >
            <AutoComplete
              options={employeeNames.map((employee) => ({
                value: employee.name,
                label: employee.name,
              }))}
              showSearch={{
                filterOption: (
                  inputValue,
                  option,
                ) =>
                  String(option?.value ?? "")
                    .toLowerCase()
                    .includes(
                      inputValue.toLowerCase(),
                    ),
              }}
              allowClear
              placeholder="Search or enter host name"
              size="large"
              className="w-full cursor-pointer"
              getPopupContainer={(triggerNode) =>
                triggerNode.parentElement!
              }
              suffixIcon={
                isLoadingEmployeeNames ? (
                  <Spinner variant="inline" />
                ) : undefined
              }
              classNames={{
                popup: {
                  listItem:
                    "employee-autocomplete-option",
                },
              }}
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              {
                required: true,
                message:
                  "Please enter your email address",
              },
              {
                type: "email",
                message:
                  "Please enter a valid email address",
              },
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
              {
                required: true,
                message:
                  "Please enter your phone number",
              },
              {
                pattern: /^[0-9+\-\s]{7,15}$/,
                message:
                  "Please enter a valid phone number",
              },
            ]}
          >
            <Input
              size="large"
              inputMode="tel"
              className="rounded-xl dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
            />
          </Form.Item>

          <Form.Item className="mb-0 mt-6">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              className="rounded-lg text-[13px] font-medium mt-35 sm:mt-0"
              icon={<ArrowRightOutlined />}
              iconPlacement="end"
            >
              Submit Registration
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}