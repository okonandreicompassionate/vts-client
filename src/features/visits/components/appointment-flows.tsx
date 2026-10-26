import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Checkbox,
  DatePicker,
  Drawer,
  Form,
  Input,
  Modal,
  Select,
  TimePicker,
  message,
} from "antd";
import { useState } from "react";

import type { BookAppointmentPayload, CreateVisitResponse } from "../types/api-types";
import type { VisitorRow } from "../utils/visits";
import { toVisitorRow } from "../utils/visits";
import { useBookAppointmentMutation } from "../api/admins-visit-api-slice";
import { useGetHostsQuery } from "../api/public-visits-api-slice";
import { Avatar } from "@/components/ui/avatar";
import StatusPill from "./visit-status-pill";

interface AppointmentFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  hostName: string;
  purposeOfVisit: string;
}

export interface CreatedAppointment {
  visitor: VisitorRow;
  requestedDate: string;
  requestedTime: string;
}

interface CreateAppointmentModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (appointment: CreatedAppointment) => void;
  hostName?: string;
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

export function CreateAppointmentModal({
  open,
  onClose,
  onCreated,
  hostName,
}: CreateAppointmentModalProps) {
  const [form] = Form.useForm<AppointmentFormValues>();
  const [bookAppointment, { isLoading }] = useBookAppointmentMutation();
  const { data: hosts = [], isLoading: isLoadingHosts } = useGetHostsQuery();
  const [requestedDate, setRequestedDate] = useState("");
  const [requestedTime, setRequestedTime] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [scheduleError, setScheduleError] = useState(false);

  const handleClose = () => {
    form.resetFields();
    setRequestedDate("");
    setRequestedTime("");
    setAppointmentDate("");
    setAppointmentTime("");
    setScheduleError(false);
    onClose();
  };

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
    };

    try {
      const response = await bookAppointment(payload).unwrap();
      onCreated({
        visitor: formatCreatedAppointment(response, payload, 0, hostName ?? values.hostName),
        requestedDate,
        requestedTime,
      });
      handleClose();
    } catch {
      message.error("Appointment could not be created. Please try again.");
    }
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      width={500}
      destroyOnHidden
      title={
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <UserAddOutlined />
          </span>
          <span>
            <span className="block text-base font-semibold">Create Appointment</span>
            <span className="block text-xs font-normal text-slate-500">
              Fill out basic info to send an onboarding link via email.
            </span>
          </span>
        </div>
      }
    >
      <Form<AppointmentFormValues>
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={handleSubmit}
        className="mt-5"
      >
        <p className="mb-3 text-xs font-medium text-slate-500">Personal Information</p>
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
          rules={[{ required: true, whitespace: true, message: "Enter a purpose of visit" }]}
        >
          <Input placeholder="Enter purpose of visit" />
        </Form.Item>

        <Form.Item
          label="Phone Number"
          name="phoneNumber"
          rules={[{ required: true, whitespace: true, message: "Enter a phone number" }]}
        >
          <Input type="tel" placeholder="Enter mobile number" autoComplete="tel" />
        </Form.Item>

        {hostName ? (
          <Form.Item label="Host">
            <Input value={hostName} readOnly />
          </Form.Item>
        ) : (
          <Form.Item
            label="Host"
            name="hostName"
            rules={[{ required: true, message: "Select a host" }]}
          >
            <Select
              placeholder="Select host"
              loading={isLoadingHosts}
              options={hosts
                .map(({ fullName }) => ({
                  label: fullName || "Unknown host",
                  value: fullName || "Unknown host",
                }))
                .filter(({ label }) => label && label !== "Unknown host")}
              showSearch
              optionFilterProp="label"
              filterOption={(input, option) =>
                String(option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
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
          <Form.Item label="Time" required>
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

        <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Submit
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

interface AppointmentDetailsDrawerProps {
  appointment: CreatedAppointment | null;
  onClose: () => void;
  onEdit: (appointment: VisitorRow) => void;
  onCancelAppointment: (appointment: VisitorRow) => void;
  onReschedule: (appointment: VisitorRow) => void;
  canManage: boolean;
}

export function AppointmentDetailsDrawer({
  appointment,
  onClose,
  onEdit,
  onCancelAppointment,
  onReschedule,
  canManage,
}: AppointmentDetailsDrawerProps) {
  const visitor = appointment?.visitor;

  return (
    <Drawer
      title="Appointment Details"
      placement="right"
      width="min(100vw, 430px)"
      open={Boolean(appointment)}
      onClose={onClose}
      destroyOnHidden
      footer={
        visitor && canManage ? (
          <div className="flex justify-between">
            <Button onClick={() => onEdit(visitor)}>Edit Appointment</Button>
            <Button onClick={() => onCancelAppointment(visitor)}>Cancel Appointment</Button>
          </div>
        ) : null
      }
    >
      {visitor && (
        <div className="space-y-4">
          <div className="rounded-xl bg-emerald-50 p-4 dark:bg-emerald-950/30">
            <p className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
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
              <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                {visitor.name}
              </p>
              <p className="truncate text-xs text-slate-500">{visitor.email}</p>
            </div>
          </div>

          <section className="rounded-lg border border-slate-200 dark:border-slate-700">
            <h3 className="border-b border-slate-100 bg-slate-50 px-3 py-2 text-xs font-semibold dark:border-slate-700 dark:bg-slate-800">
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
                </dd>
              </div>
            </dl>
          </section>

          {canManage && (
            <Button
              block
              icon={<ClockCircleOutlined />}
              onClick={() => onReschedule(visitor)}
            >
              Reschedule Appointment
            </Button>
          )}
        </div>
      )}
    </Drawer>
  );
}

interface AppointmentActionModalProps {
  mode: "cancel" | "reschedule";
  appointment: VisitorRow | null;
  onClose: () => void;
}

export function AppointmentActionModal({
  mode,
  appointment,
  onClose,
}: AppointmentActionModalProps) {
  const [confirmed, setConfirmed] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleClose = () => {
    setConfirmed(false);
    setDate("");
    setTime("");
    onClose();
  };

  const isCancel = mode === "cancel";

  return (
    <Modal
      open={Boolean(appointment)}
      onCancel={handleClose}
      footer={null}
      width={440}
      destroyOnHidden
      title={null}
    >
      <div className="py-2 text-center">
        <span
          className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${
            isCancel ? "bg-rose-50 text-rose-500" : "bg-emerald-50 text-emerald-600"
          }`}
        >
          {isCancel ? <ExclamationCircleOutlined /> : <CalendarOutlined />}
        </span>
        <h2 className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
          {isCancel ? "Cancel appointment?" : "Reschedule Appointment"}
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          {isCancel
            ? "Are you sure you want to cancel this appointment?"
            : "Choose a new date and time for this appointment."}
        </p>

        {appointment && (
          <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 text-left dark:border-slate-700">
            <div className="grid grid-cols-2 bg-sky-50 px-3 py-2 text-[10px] font-semibold uppercase text-slate-500 dark:bg-slate-800">
              <span>Visitor</span>
              <span>{isCancel ? "Reason" : "Current appointment"}</span>
            </div>
            <div className="grid grid-cols-2 px-3 py-3 text-xs">
              <span className="font-medium">{appointment.name}</span>
              <span className="text-slate-600 dark:text-slate-300">
                {isCancel
                  ? appointment.purpose
                  : `${appointment.time} · Schedule not available from API`}
              </span>
            </div>
          </div>
        )}

        {!isCancel && (
          <div className="mt-4 grid grid-cols-2 gap-3 text-left">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
              New Date
              <DatePicker
                className="mt-1 w-full"
                format="MMM D, YYYY"
                onChange={(_value, dateString) =>
                  setDate(typeof dateString === "string" ? dateString : "")
                }
              />
            </label>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
              New Time
              <TimePicker
                className="mt-1 w-full"
                format="h:mm A"
                use12Hours
                onChange={(_value, timeString) => setTime(timeString ?? "")}
              />
            </label>
            <Form.Item className="col-span-2 mb-0!" label="Reason for Rescheduling (Optional)">
              <Input.TextArea rows={3} placeholder="Enter description" />
            </Form.Item>
          </div>
        )}

        <div className="mt-4 text-left">
          <Checkbox checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)}>
            <span className="text-xs text-slate-500">
              I understand this action is sensitive and may not be reversible.
            </span>
          </Checkbox>
        </div>

        <Alert
          className="mt-4 text-left"
          type="info"
          showIcon
          message={`The ${isCancel ? "cancellation" : "reschedule"} endpoint has not been provided yet.`}
        />

        <div className="mt-5 flex justify-end gap-2">
          <Button onClick={handleClose}>{isCancel ? "Keep Appointment" : "Close"}</Button>
          <Button
            danger={isCancel}
            type="primary"
            disabled
            title={
              isCancel
                ? "Waiting for a cancellation endpoint"
                : !date || !time
                  ? "Select a new date and time"
                  : "Waiting for a reschedule endpoint"
            }
          >
            {isCancel ? "Cancel Appointment" : "Submit"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export function AppointmentEditModal({
  appointment,
  onClose,
}: {
  appointment: VisitorRow | null;
  onClose: () => void;
}) {
  return (
    <Modal
      open={Boolean(appointment)}
      onCancel={onClose}
      footer={null}
      width={480}
      destroyOnHidden
      title="Edit Appointment"
    >
      {appointment && (
        <Form
          key={appointment.id}
          layout="vertical"
          initialValues={{
            visitorName: appointment.name,
            email: appointment.email === "N/A" ? "" : appointment.email,
            phoneNumber: appointment.phone === "N/A" ? "" : appointment.phone,
            host: appointment.host === "Unassigned" ? undefined : appointment.host,
            purpose: appointment.purpose === "N/A" ? "" : appointment.purpose,
          }}
          className="pt-4"
        >
          <Form.Item label="Visitor Name" name="visitorName">
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input type="email" />
          </Form.Item>
          <Form.Item label="Phone Number" name="phoneNumber">
            <Input type="tel" />
          </Form.Item>
          <Form.Item label="Host" name="host">
            <Input />
          </Form.Item>
          <Form.Item label="Purpose" name="purpose">
            <Input.TextArea rows={2} />
          </Form.Item>

          <Alert
            className="mb-4"
            type="info"
            showIcon
            message="The appointment update endpoint has not been provided yet. Changes cannot be saved."
          />
          <div className="flex justify-end gap-2">
            <Button onClick={onClose}>Close</Button>
            <Button type="primary" disabled title="Waiting for an appointment update endpoint">
              Save Changes
            </Button>
          </div>
        </Form>
      )}
    </Modal>
  );
}

export function AppointmentCreatedModal({
  appointment,
  onClose,
  onView,
}: {
  appointment: CreatedAppointment | null;
  onClose: () => void;
  onView: () => void;
}) {
  return (
    <Modal open={Boolean(appointment)} onCancel={onClose} footer={null} width={380}>
      <div className="py-3 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
          <CheckCircleOutlined />
        </span>
        <h2 className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
          Appointment
        </h2>
        <p className="mx-auto mt-1 max-w-xs text-xs text-slate-500">
          Your appointment has been created and is now awaiting approval.
        </p>
        <div className="mt-5 flex justify-center gap-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" onClick={onView}>
            View
          </Button>
        </div>
      </div>
    </Modal>
  );
}
