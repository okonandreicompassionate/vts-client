import { Alert, Button, Form, Input, message, Select } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";

import { usePopup } from "@/lib/contexts/popup/use-popup";
import { useAppDispatch, useAppSelector } from "@/lib/stores/hooks";
import RegistrationModal from "./modals/visit-request-modal";
import RegistrationSuccessModal from "./modals/request-success-modal";
import type { RegistrationValues } from "../types/registration-values";
import { paths } from "../../../config/paths";
import { useOrganization } from "@/features/visitor-portal";
import { setVisitorSession } from "@/features/visitor-portal/stores/visitor-auth-slice";
import {
  useGetVisitorEntryQuery,
  useCreateVisitMutation,
  useGetHostsQuery,
  useGetVisitorVerificationStatusQuery,
} from "../api/public-visits-api-slice";
import { Spinner } from "@/components/ui/spinner";
import type { VisitorEntry, AvailableAppointment } from "../types/visitor-entry";
import type { HostItem } from "@/types/visit-api";
import { getVisitActionErrorMessage } from "@/utils/visit-action-error";
import { PurposeOfVisitSelect } from "@/components/ui/purpose-of-visit-select";
import { useSubmissionKey } from "@/hooks/use-submission-key";
import {
  readVisitRequestDraft,
  saveVisitRequestDraft,
  clearVisitRequestDraft,
} from "../utils/visit-request-draft";

const PURPOSE_OF_VISIT_MAX_LENGTH = 60;

export default function Registration() {
  const { orgSlug } = useOrganization();
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get("appointment");
  const navigate = useNavigate();
  const { data: status } = useGetVisitorVerificationStatusQuery(orgSlug);
  const email = status?.entryEmail ?? "";
  const {
    currentData: entry,
    isLoading,
    isFetching,
    isError,
  } = useGetVisitorEntryQuery(
    { orgSlug, email },
    { skip: !email, refetchOnMountOrArgChange: true },
  );
  if (!email) return <Navigate to={paths.verify.getHref(orgSlug)} replace />;
  if (isLoading || (isFetching && !entry)) return <Spinner variant="page" />;
  if (isError || !entry)
    return (
      <div className="space-y-4">
        <Alert
          type="error"
          message="Your visitor details could not be loaded. Please enter your email again."
        />
        <Button onClick={() => navigate(paths.verify.getHref(orgSlug))}>Enter email</Button>
      </div>
    );
  const appointment = appointmentId
    ? entry.appointments.find((item) => item.id === appointmentId)
    : undefined;
  if (appointmentId && !appointment)
    return (
      <div className="space-y-4">
        <Alert
          type="info"
          message="This appointment is no longer available. Please look up your email to choose another appointment or request a new visit."
        />
        <Button onClick={() => navigate(paths.verify.getHref(orgSlug))}>
          Choose another appointment
        </Button>
      </div>
    );
  return (
    <RegistrationForm
      key={entry.email + ":" + (appointment?.id ?? "new")}
      entry={entry}
      appointment={appointment}
    />
  );
}

function RegistrationForm({
  entry,
  appointment,
}: {
  entry: VisitorEntry;
  appointment?: AvailableAppointment;
}) {
  const { orgSlug } = useOrganization();
  const [form] = Form.useForm<RegistrationValues>();
  const { openModal, closeModal } = usePopup();
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const { visitorId } = useAppSelector((state) => state.visitorAuth);

  const [createVisit] = useCreateVisitMutation();
  const submission = useSubmissionKey(`visitor:${orgSlug}`);
  const { refetch: refetchVerification } = useGetVisitorVerificationStatusQuery(orgSlug);

  const {
    data: hosts = [],
    isError: isHostsError,
    isLoading: isLoadingHosts,
  } = useGetHostsQuery(orgSlug);
  const selectableHosts = hosts.filter(
    (host): host is HostItem & { id: string; fullName: string } =>
      Boolean(host.id?.trim() && host.fullName?.trim()),
  );

  if (appointment?.hostId && !selectableHosts.some((host) => host.id === appointment.hostId))
    selectableHosts.push({
      id: appointment.hostId,
      fullName: appointment.hostName || "Assigned host",
    });
  const draft = readVisitRequestDraft(orgSlug);
  const initialValues = {
    firstName: entry.visitor?.firstName ?? "",
    lastName: entry.visitor?.lastName ?? "",
    phoneNo: entry.visitor?.phone ?? "",
    ...(!appointment && draft.email === entry.email ? draft : {}),
    ...(appointment
      ? {
          firstName: appointment.firstName,
          lastName: appointment.lastName,
          phoneNo: appointment.contactPhone ?? entry.visitor?.phone ?? "",
          purposeOfVisit: appointment.purpose,
          hostId: appointment.hostId ?? undefined,
        }
      : {}),
    email: entry.email,
  };

  const handleFinish = async (values: RegistrationValues) => {
    const fullName = `${values.firstName.trim()} ${values.lastName.trim()}`.trim();
    const selectedHost = appointment
      ? { id: appointment.hostId ?? "", fullName: appointment.hostName ?? "Unassigned host" }
      : selectableHosts.find((host) => host.id === values.hostId);

    if (!selectedHost) {
      message.error("Please select a valid host and try again.");
      return;
    }

    openModal(
      <RegistrationModal
        existingAppointment={Boolean(appointment)}
        onSubmit={async () => {
          openModal(
            <RegistrationSuccessModal
              existingAppointment={Boolean(appointment)}
              loading
              onOk={() => navigate(paths.visitorProfile.getHref(orgSlug))}
            />,
          );

          try {
            const payload = {
              orgSlug,
              appointmentId: appointment?.id,
              visitorId: visitorId ?? undefined,
              firstName: values.firstName.trim(),
              lastName: values.lastName.trim(),
              email: values.email,
              phone: values.phoneNo,
              purpose: values.purposeOfVisit,
              hostId: selectedHost.id || undefined,
            };
            const response = await createVisit({
              ...payload,
              idempotencyKey: submission.getKey(payload),
            }).unwrap();
            submission.complete();

            const resolvedVisitorId = response?.visitorId ?? visitorId;

            if (resolvedVisitorId) {
              dispatch(
                setVisitorSession({
                  visitorId: resolvedVisitorId,
                  fullName,
                  email: values.email,
                  phoneNumber: values.phoneNo,
                  emailVerified: response.emailVerified === true,
                  sessionVisitId: response.emailVerified ? undefined : response.id,
                }),
              );
            }

            // Older versions kept the visitor's contact details here; shared
            // devices (gate tablets) shouldn't. The server is the source of truth.
            try {
              localStorage.removeItem("visitorRegistration");
            } catch {
              // Storage unavailable: nothing was stored either.
            }

            clearVisitRequestDraft(orgSlug);
            form.resetFields();

            openModal(
              <RegistrationSuccessModal
                existingAppointment={Boolean(appointment)}
                loading={false}
                onOk={() => navigate(paths.visitorProfile.getHref(orgSlug, response.id))}
              />,
            );
          } catch (error) {
            console.error("Registration failed:", error);

            closeModal();

            if (
              error &&
              typeof error === "object" &&
              "data" in error &&
              error.data &&
              typeof error.data === "object" &&
              "code" in error.data &&
              error.data.code === "EMAIL_VERIFICATION_REQUIRED"
            ) {
              saveVisitRequestDraft(orgSlug, values);
              void refetchVerification();
              navigate(paths.verify.getHref(orgSlug));
            }

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
    <div className="flex w-full flex-col items-center md:justify-center dark:bg-zinc-900">
     {!appointment && (
        <p className="mb-6 w-full border-b border-slate-400 text-lg font-semibold text-slate-700 md:text-xl dark:text-zinc-200">
          Check in Details
        </p>
      )}

     
      <div className="flex w-full flex-col md:max-w-lg">
        <Form
          form={form}
          initialValues={initialValues}
          onValuesChange={(_changed, values: RegistrationValues) =>
            saveVisitRequestDraft(orgSlug, values)
          }
          layout="vertical"
          onFinish={handleFinish}
          className="flex flex-col md:flex-none dark:border-zinc-700 dark:bg-zinc-900"
        >
          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: "Please enter your email address" },
              { type: "email", message: "Please enter a valid email address" },
            ]}
          >
            <Input
              type="email"
              autoComplete="email"
              placeholder="Enter your email address"
              readOnly
            />
          </Form.Item>

          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true, whitespace: true, message: "Please enter your first name" }]}
          >
            <Input readOnly={Boolean(appointment)} />
          </Form.Item>

          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, whitespace: true, message: "Please enter your last name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="purposeOfVisit"
            label="Purpose of Visit"
            rules={[
              { required: true, whitespace: true, message: "Please select or enter a purpose" },
              {
                max: appointment ? undefined : PURPOSE_OF_VISIT_MAX_LENGTH,
                message: `Purpose of visit can't exceed ${PURPOSE_OF_VISIT_MAX_LENGTH} characters`,
              },
            ]}
          >
            {appointment ? (
              <Input readOnly />
            ) : (
              <PurposeOfVisitSelect maxLength={PURPOSE_OF_VISIT_MAX_LENGTH} />
            )}
          </Form.Item>

          <Form.Item
            name="hostId"
            label="Host Name"
            rules={appointment ? [] : [{ required: true, message: "Please select a host" }]}
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
              className="w-full"
              loading={isLoadingHosts}
              disabled={Boolean(appointment) || isHostsError || selectableHosts.length === 0}
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
            name="phoneNo"
            label="Phone Number"
            rules={[
              { required: true, message: "Please enter your phone number" },
              {
                pattern: appointment?.contactPhone ? undefined : /^[0-9+\-\s]{7,15}$/,
                message: "Please enter a valid phone number",
              },
            ]}
          >
            <Input inputMode="tel" readOnly={Boolean(appointment?.contactPhone)} />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            icon={<ArrowRightOutlined />}
            iconPlacement="end"
            className="mt-4"
          >
            {appointment ? "Continue with this appointment" : "Submit Request"}
          </Button>

     
        </Form>
        <div className="w-full flex items-center justify-center mt-3">
                <Button
        type="link"
        className="mb-3 self-start px-0! place-self-center w-fukl"
        onClick={() => navigate(paths.verify.getHref(orgSlug))}
      >
        Use a different email or appointment
      </Button>
        </div>
       
      </div>
    </div>
  );
}
