import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Checkbox, DatePicker, Form, Input, Select, TimePicker, message } from "antd";
import { useState, type ReactNode } from "react";

import { Avatar } from "@/components/ui/avatar";
import CustomDrawer from "@/components/ui/custom-drawer";
import CustomModal from "@/components/ui/custom-modal";
import { PurposeOfVisitSelect } from "@/components/ui/purpose-of-visit-select";
import { useAdminAuthSession } from "@/features/auth/hooks/use-auth-session";
import { useSubmissionKey } from "@/hooks/use-submission-key";
import { usePopup } from "@/lib/contexts/popup/use-popup";
import { adminRoles, hasRole } from "@/types/user-role";
import type { CreateVisitResponse } from "@/types/visit-api";
import { getApiErrorMessage } from "@/utils/api-error";
import { fullNameRules, splitFullName } from "@/utils/full-name";
import {
  useBookAppointmentMutation,
  useCancelVisitMutation,
  useGetStaffHostsQuery,
  useRescheduleVisitMutation,
  useUpdateVisitMutation,
} from "../api/admins-visit-api-slice";
import { useRefetchVisitLists } from "../hooks/use-refetch-visit-lists";
import type { BookAppointmentPayload } from "../types/api-types";
import type { VisitorRow } from "../utils/visits";
import { toVisitorRow } from "../utils/visits";
import StatusPill from "./visit-status-pill";
import HostDecisionTag from "./host-decision-tag";
import HostDecisionModal from "./modals/host-decision-modal";
import { getHostDecisionActions } from "../utils/appointment-row-actions";

// Every popup here is opened through `usePopup()` (openModal/openDrawer) and owns
// its own state, so it doesn't depend on the page re-rendering it.

interface AppointmentFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  hostId?: string;
  purposeOfVisit: string;
}

export interface CreatedAppointment {
  visitor: VisitorRow;
  requestedDate: string;
  requestedTime: string;
}

function formatCreatedAppointment(
  response: CreateVisitResponse,
  payload: BookAppointmentPayload,
  index: number,
  hostName: string,
): VisitorRow {
  return toVisitorRow(
    {
      id: response.id,
      referenceId: response.referenceId,
      fullName: response.visitorName || `${payload.firstName} ${payload.lastName}`,
      email: response.visitor?.email ?? payload.email,
      phoneNumber: response.visitor?.phoneNumber ?? payload.phone,
      hostName: response.hostName || hostName,
      purposeOfVisit: response.purposeOfVisit || payload.purpose,
      status: response.status,
      registeredAt: response.createdAt,
      reviewedAt: response.reviewedAt,
      checkInTime: response.checkInTime,
      checkOutTime: response.checkOutTime,
    },
    index,
  );
}

/** Opened with `openModal(<CreateAppointmentModal … />)`. On success it shows `AppointmentCreatedModal`. */
export function CreateAppointmentModal({
  hostName,
  canChooseHost,
  canManage,
}: {
  /** Fixed to the signed-in user for non-admin and non-facility creators. */
  hostName?: string;
  /** Only admins and facility staff may assign another host. */
  canChooseHost: boolean;
  /** Whether the follow-up details drawer offers edit/reschedule/cancel. */
  canManage: boolean;
}) {
  const { openModal } = usePopup();
  const refetchVisitLists = useRefetchVisitLists();
  const [form] = Form.useForm<AppointmentFormValues>();
  const [bookAppointment, { isLoading }] = useBookAppointmentMutation();
  const submission = useSubmissionKey("staff-booking");
  const { data: hosts = [], isLoading: isLoadingHosts } = useGetStaffHostsQuery(undefined, {
    skip: !canChooseHost,
  });
  const [requestedDate, setRequestedDate] = useState("");
  const [requestedTime, setRequestedTime] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [scheduleError, setScheduleError] = useState(false);

  const handleSubmit = async (values: AppointmentFormValues) => {
    if (!requestedDate || !requestedTime) {
      setScheduleError(true);
      return;
    }

    const payload: BookAppointmentPayload = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
      phone: values.phoneNumber.trim(),
      purpose: values.purposeOfVisit.trim(),
      date: appointmentDate,
      time: appointmentTime,
      // Without this the server books the visit for whoever is signed in.
      ...(values.hostId ? { hostId: values.hostId } : {}),
    };
    const selectedHostName = canChooseHost
      ? (hosts.find((host) => host.id === values.hostId)?.fullName ?? "")
      : (hostName ?? "");

    try {
      const response = await bookAppointment({
        ...payload,
        idempotencyKey: submission.getKey(payload),
      }).unwrap();
      submission.complete();

      openModal(
        <AppointmentCreatedModal
          appointment={{
            visitor: formatCreatedAppointment(response, payload, 0, selectedHostName),
            requestedDate,
            requestedTime,
          }}
          canManage={canManage}
        />,
      );

      void refetchVisitLists().catch(() =>
        message.error("Appointment created, but the list could not be refreshed."),
      );
    } catch (error) {
      message.error(
        getApiErrorMessage(error, "Appointment could not be created. Please try again."),
      );
    }
  };

  return (
    <CustomModal disableClose={isLoading}>
      <CustomModal.Header
        title="Create appointment"
        // subtitle="Fill out basic info to send an onboarding link via email."
        // icon={<UserAddOutlined />}
        tone="emerald"
      />

      <CustomModal.Body>
        <Form<AppointmentFormValues> form={form} layout="vertical" onFinish={handleSubmit}>
          <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-2">
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[{ required: true, whitespace: true, message: "Enter a first name" }]}
            >
              <Input placeholder="Enter first name" autoComplete="given-name" />
            </Form.Item>
            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[{ required: true, whitespace: true, message: "Enter a last name" }]}
            >
              <Input placeholder="Enter last name" autoComplete="family-name" />
            </Form.Item>
          </div>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Enter an email address" },
              { type: "email", message: "Enter a valid email address" },
            ]}
          >
            <Input type="email" placeholder="Enter email" autoComplete="email" />
          </Form.Item>

          <Form.Item
            label="Purpose of Visit"
            name="purposeOfVisit"
            rules={[
              { required: true, whitespace: true, message: "Select or enter a purpose of visit" },
            ]}
          >
            <PurposeOfVisitSelect />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            rules={[{ required: true, whitespace: true, message: "Enter a phone number" }]}
          >
            <Input type="tel" placeholder="Enter mobile number" autoComplete="tel" />
          </Form.Item>

          {canChooseHost ? (
            <Form.Item
              label="Host"
              name="hostId"
              rules={[{ required: true, message: "Select a host" }]}
            >
              <Select
                placeholder="Select host"
                loading={isLoadingHosts}
                options={hosts
                  .filter((host) => host.id && host.fullName)
                  .map((host) => ({ label: host.fullName, value: host.id }))}
                showSearch
                optionFilterProp="label"
                filterOption={(input, option) =>
                  String(option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </Form.Item>
          ) : (
            <Form.Item label="Host">
              <Input value={hostName ?? ""} readOnly />
            </Form.Item>
          )}

          <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-2">
            <Form.Item label="Date" required>
              <DatePicker
                className="w-full"
                format="MMM D, YYYY"
                placeholder="Select date"
                onChange={(_date, dateString) => {
                  setRequestedDate(typeof dateString === "string" ? dateString : "");
                  setAppointmentDate(_date?.format("YYYY-MM-DD") ?? "");
                  setScheduleError(false);
                }}
              />
            </Form.Item>
            <Form.Item label="Time (Lagos)" required>
              <TimePicker
                className="w-full"
                format="h:mm A"
                use12Hours
                placeholder="Select time"
                onChange={(time, timeString) => {
                  setRequestedTime(timeString ?? "");
                  setAppointmentTime(time?.format("HH:mm") ?? "");
                  setScheduleError(false);
                }}
              />
            </Form.Item>
          </div>

          {scheduleError && (
            <p role="alert" className="-mt-2 mb-3 text-xs text-red-500">
              Select both a date and a time.
            </p>
          )}
        </Form>
      </CustomModal.Body>

      <CustomModal.Footer okText="Submit" loading={isLoading} onOk={() => form.submit()} />
    </CustomModal>
  );
}

/** Opened with `openDrawer(<AppointmentDetailsDrawer … />)`. */
export function AppointmentDetailsDrawer({
  appointment,
  canManage,
}: {
  appointment: CreatedAppointment;
  canManage: boolean;
}) {
  const { closeDrawer, openModal } = usePopup();
  const { data: currentUser } = useAdminAuthSession();
  const visitor = appointment.visitor;

  // Edit/cancel/reschedule replace the drawer with their modal.
  const openInsteadOfDrawer = (modal: ReactNode) => {
    closeDrawer();
    openModal(modal);
  };

  return (
    <CustomDrawer
      title="Appointment Details"
      width="min(100vw, 430px)"
      actionsLabel={visitor.name}
      actions={{
        primary: getHostDecisionActions(visitor, {
          currentUserId: currentUser?.id,
          onHostDecide: (row, decision) =>
            openInsteadOfDrawer(<HostDecisionModal appointment={row} decision={decision} />),
        }),
        secondary: canManage
          ? [
              {
                key: "edit",
                label: "Edit",
                icon: <EditOutlined />,
                onSelect: () => openInsteadOfDrawer(<AppointmentEditModal appointment={visitor} />),
              },
              {
                key: "reschedule",
                label: "Reschedule",
                icon: <ClockCircleOutlined />,
                onSelect: () =>
                  openInsteadOfDrawer(
                    <AppointmentActionModal mode="reschedule" appointment={visitor} />,
                  ),
              },
              {
                key: "cancel",
                label: "Cancel Appointment",
                icon: <DeleteOutlined />,
                danger: true,
                onSelect: () =>
                  openInsteadOfDrawer(
                    <AppointmentActionModal mode="cancel" appointment={visitor} />,
                  ),
              },
            ]
          : [],
      }}
    >
      <div className="space-y-4">
        <div className="rounded-xl bg-emerald-50 p-4 dark:bg-emerald-950/30">
          <p className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-zinc-100">
            <CalendarOutlined className="text-emerald-600" />
            {visitor.purpose}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Please check the visitor&apos;s details before the appointment.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-lg border border-emerald-100 bg-emerald-50/60 p-3 dark:border-emerald-900 dark:bg-emerald-950/20">
          <Avatar name={visitor.name} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-900 dark:text-zinc-100">
              {visitor.name}
            </p>
            <p className="truncate text-xs text-slate-500">{visitor.email}</p>
          </div>
        </div>

        <section className="rounded-lg border border-slate-200 dark:border-zinc-700">
          <h3 className="border-b border-slate-100 bg-slate-50 px-3 py-2 text-xs font-semibold dark:border-zinc-700 dark:bg-zinc-800">
            Appointment Information
          </h3>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 p-3 text-xs">
            <div>
              <dt className="text-slate-500">Visitor Name</dt>
              <dd className="mt-1 font-medium">{visitor.name}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Host</dt>
              <dd className="mt-1 font-medium">{visitor.host}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Requested Date</dt>
              <dd className="mt-1 font-medium">
                {appointment.requestedDate || visitor.requestedDate || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Requested Time</dt>
              <dd className="mt-1 font-medium">
                {appointment.requestedTime || visitor.requestedTime || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Purpose</dt>
              <dd className="mt-1 font-medium">{visitor.purpose}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Status</dt>
              <dd className="mt-1">
                <StatusPill status={visitor.status} />
                <HostDecisionTag decision={visitor.hostDecision} status={visitor.status} />
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Source</dt>
              <dd className="mt-1 font-medium">
                {visitor.source === "STAFF_BOOKING" ? "Booked by staff" : "Walk-in"}
              </dd>
            </div>
            {visitor.hostNote && (
              <div className="col-span-2">
                <dt className="text-slate-500">Host&apos;s note</dt>
                <dd className="mt-1 font-medium">{visitor.hostNote}</dd>
              </div>
            )}
          </dl>
        </section>
      </div>
    </CustomDrawer>
  );
}

/** Opened with `openModal(<AppointmentActionModal mode="cancel" | "reschedule" … />)`. */
export function AppointmentActionModal({
  mode,
  appointment,
}: {
  mode: "cancel" | "reschedule";
  appointment: VisitorRow;
}) {
  const { closeModal } = usePopup();
  const [confirmed, setConfirmed] = useState(false);
  // What the server expects: "YYYY-MM-DD" and 24-hour "HH:mm".
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [rescheduleVisit, { isLoading: isRescheduling }] = useRescheduleVisitMutation();
  const [cancelVisit, { isLoading: isCancelling }] = useCancelVisitMutation();

  const isCancel = mode === "cancel";
  const currentSchedule = appointment.requestedDate
    ? [appointment.requestedDate, appointment.requestedTime].filter(Boolean).join(" · ")
    : "No date set";

  const handleSubmit = async () => {
    try {
      if (isCancel) {
        await cancelVisit({ id: appointment.id, reason: reason.trim() || undefined }).unwrap();
        message.success("Appointment cancelled.");
      } else {
        await rescheduleVisit({ id: appointment.id, date, time }).unwrap();
        message.success("Appointment rescheduled.");
      }
      closeModal();
    } catch (error) {
      message.error(
        getApiErrorMessage(
          error,
          isCancel
            ? "The appointment could not be cancelled. Please try again."
            : "The appointment could not be rescheduled. Please try again.",
        ),
      );
    }
  };

  const missingSchedule = !isCancel && (!date || !time);

  return (
    <CustomModal size="sm" disableClose={isRescheduling || isCancelling}>
      <CustomModal.Header
        title={isCancel ? "Cancel appointment?" : "Reschedule appointment"}
        subtitle={
          isCancel
            ? "The visitor won't be able to check in for this visit."
            : "Choose a new date and time for this appointment."
        }
        icon={isCancel ? <ExclamationCircleOutlined /> : <CalendarOutlined />}
        tone={isCancel ? "rose" : "emerald"}
      />

      <CustomModal.Body scroll={false}>
        <div>
          <div className="overflow-hidden rounded-lg border border-slate-200 text-left dark:border-zinc-700">
            <div className="grid grid-cols-2 bg-sky-50 px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase dark:bg-zinc-800">
              <span>Visitor</span>
              <span>Current appointment</span>
            </div>
            <div className="grid grid-cols-2 px-3 py-3 text-xs">
              <span className="font-medium">{appointment.name}</span>
              <span className="text-slate-600 dark:text-zinc-300">{currentSchedule}</span>
            </div>
          </div>

          {isCancel ? (
            <label className="mt-4 block text-left text-xs font-medium text-slate-700 dark:text-zinc-300">
              Reason (optional)
              <Input.TextArea
                className="mt-1"
                rows={3}
                maxLength={500}
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder="Why is this visit being cancelled?"
              />
            </label>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-3 text-left">
              <label className="text-xs font-medium text-slate-700 dark:text-zinc-300">
                New Date
                <DatePicker
                  className="mt-1 w-full"
                  format="MMM D, YYYY"
                  onChange={(value) => setDate(value?.format("YYYY-MM-DD") ?? "")}
                />
              </label>
              <label className="text-xs font-medium text-slate-700 dark:text-zinc-300">
                New Time
                <TimePicker
                  className="mt-1 w-full"
                  format="h:mm A"
                  use12Hours
                  onChange={(value) => setTime(value?.format("HH:mm") ?? "")}
                />
              </label>
            </div>
          )}

          <div className="mt-4 text-left">
            <Checkbox checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)}>
              <span className="text-xs text-slate-500">
                I understand this action is sensitive and may not be reversible.
              </span>
            </Checkbox>
          </div>
        </div>
      </CustomModal.Body>

      <CustomModal.Footer
        cancelText={isCancel ? "Keep appointment" : "Close"}
        okText={isCancel ? "Cancel appointment" : "Reschedule"}
        danger={isCancel}
        disabled={missingSchedule || !confirmed}
        loading={isRescheduling || isCancelling}
        onOk={() => void handleSubmit()}
        okTitle={
          missingSchedule
            ? "Select a new date and time"
            : !confirmed
              ? "Tick the confirmation box first"
              : undefined
        }
      />
    </CustomModal>
  );
}

interface AppointmentEditValues {
  fullName: string;
  phone: string;
  hostId?: string;
  purpose: string;
}

/**
 * Opened with `openModal(<AppointmentEditModal appointment={row} />)`.
 * The visitor's email is how they verify themselves, so it can't be edited.
 */
export function AppointmentEditModal({ appointment }: { appointment: VisitorRow }) {
  const { closeModal } = usePopup();
  const { data: currentUser } = useAdminAuthSession();
  // Matches the server: only admins may move a visit to another host.
  const canChangeHost = hasRole(currentUser?.role, adminRoles);
  const [form] = Form.useForm<AppointmentEditValues>();
  const [updateVisit, { isLoading }] = useUpdateVisitMutation();
  const { data: hosts = [], isLoading: isLoadingHosts } = useGetStaffHostsQuery(undefined, {
    skip: !canChangeHost,
  });

  const handleSave = async (values: AppointmentEditValues) => {
    try {
      await updateVisit({
        id: appointment.id,
        ...splitFullName(values.fullName),
        phone: values.phone.trim(),
        purpose: values.purpose.trim(),
        ...(canChangeHost && values.hostId ? { hostId: values.hostId } : {}),
      }).unwrap();
      message.success("Appointment updated.");
      closeModal();
    } catch (error) {
      message.error(
        getApiErrorMessage(error, "The appointment could not be updated. Please try again."),
      );
    }
  };

  return (
    <CustomModal disableClose={isLoading}>
      <CustomModal.Header title="Edit appointment" />

      <CustomModal.Body>
        <Form<AppointmentEditValues>
          form={form}
          layout="vertical"
          onFinish={handleSave}
          initialValues={{
            fullName: appointment.name,
            phone: appointment.phone === "N/A" ? "" : appointment.phone,
            hostId: appointment.hostId ?? undefined,
            purpose: appointment.purpose === "N/A" ? "" : appointment.purpose,
          }}
          className="pt-4"
        >
          <Form.Item label="Visitor Name" name="fullName" rules={fullNameRules}>
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item
            label="Email"
            tooltip="The visitor's email is how they sign in, so it can't be changed."
          >
            <Input type="email" value={appointment.email} disabled />
          </Form.Item>
          <Form.Item
            label="Phone Number"
            name="phone"
            rules={[{ required: true, whitespace: true, message: "Enter a phone number" }]}
          >
            <Input type="tel" />
          </Form.Item>
          {canChangeHost ? (
            <Form.Item
              label="Host"
              name="hostId"
              rules={[{ required: true, message: "Select a host" }]}
            >
              <Select
                placeholder="Select host"
                loading={isLoadingHosts}
                showSearch
                optionFilterProp="label"
                options={hosts
                  .filter((host) => host.id && host.fullName)
                  .map((host) => ({ label: host.fullName, value: host.id }))}
              />
            </Form.Item>
          ) : (
            <Form.Item label="Host">
              <Input value={appointment.host} disabled />
            </Form.Item>
          )}
          <Form.Item
            label="Purpose"
            name="purpose"
            rules={[
              { required: true, whitespace: true, message: "Select or enter a purpose of visit" },
            ]}
          >
            <PurposeOfVisitSelect />
          </Form.Item>
        </Form>
      </CustomModal.Body>

      <CustomModal.Footer
        okText="Save changes"
        cancelText="Close"
        loading={isLoading}
        onOk={() => form.submit()}
      />
    </CustomModal>
  );
}

/** Shown after booking. "View" swaps it for the appointment's details drawer. */
export function AppointmentCreatedModal({
  appointment,
  canManage,
}: {
  appointment: CreatedAppointment;
  canManage: boolean;
}) {
  const { closeModal, openDrawer } = usePopup();

  return (
    <CustomModal size="sm">
      <CustomModal.Header
        title="Appointment created"
        subtitle={
          appointment.visitor.status === "Approved"
            ? "It's approved and the gate can check the visitor in."
            : "It's now awaiting approval."
        }
        icon={<CheckCircleOutlined />}
        tone="emerald"
      />

      <CustomModal.Footer
        okText="View appointment"
        cancelText="Close"
        onOk={() => {
          closeModal();
          openDrawer(<AppointmentDetailsDrawer appointment={appointment} canManage={canManage} />);
        }}
      />
    </CustomModal>
  );
}
