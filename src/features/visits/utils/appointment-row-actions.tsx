import {
  CalendarOutlined,
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";

import type { RowAction } from "@/components/ui/row-actions";
import type { VisitorRow } from "./visits";

// Match the server (appointment-visibility.ts).
const EDITABLE: VisitorRow["status"][] = ["Pending", "Approved"];
const RESCHEDULABLE: VisitorRow["status"][] = ["Pending", "Approved", "Rejected", "Expired"];

interface AppointmentActionHandlers {
  /** Reviewers approve or reject pending appointments. */
  canReview: boolean;
  /** The host or an admin may edit, reschedule and cancel. */
  canManage: boolean;
  /** The signed-in staff member, so their own visits offer the host decision. */
  currentUserId?: string;
  onHostDecide: (appointment: VisitorRow, decision: "APPROVED" | "REJECTED") => void;
  onApprove: (appointment: VisitorRow) => void;
  onReject: (appointment: VisitorRow) => void;
  onEdit: (appointment: VisitorRow) => void;
  onReschedule: (appointment: VisitorRow) => void;
  onCancel: (appointment: VisitorRow) => void;
  /** Table rows only; a details drawer is already the view. */
  onView?: (appointment: VisitorRow) => void;
  busy?: boolean;
}

/** The host's approve/decline, offered while their answer is still awaited. */
export function getHostDecisionActions(
  appointment: VisitorRow,
  {
    currentUserId,
    onHostDecide,
  }: Pick<AppointmentActionHandlers, "currentUserId" | "onHostDecide">,
): RowAction[] {
  const awaitingHost =
    appointment.status === "Pending" &&
    appointment.hostDecision === "PENDING" &&
    Boolean(currentUserId) &&
    appointment.hostId === currentUserId;

  return awaitingHost
    ? [
        { key: "host-approve", label: "Approve", icon: <CheckOutlined />, onSelect: () => onHostDecide(appointment, "APPROVED") },
        { key: "host-decline", label: "Decline", icon: <CloseOutlined />, danger: true, onSelect: () => onHostDecide(appointment, "REJECTED") },
      ]
    : [];
}

/** The one list of appointment actions, shared by table rows and the details drawer. */
export function getAppointmentActions(
  appointment: VisitorRow,
  handlers: AppointmentActionHandlers,
): { primary: RowAction[]; secondary: RowAction[] } {
  const { canReview, canManage, busy = false } = handlers;
  const run = (handler: (appointment: VisitorRow) => void) => () => handler(appointment);

  const primary: RowAction[] =
    canReview && appointment.status === "Pending"
      ? [
          { key: "approve", label: "Approve", icon: <CheckOutlined />, disabled: busy, onSelect: run(handlers.onApprove) },
          { key: "reject", label: "Reject", icon: <CloseOutlined />, danger: true, disabled: busy, onSelect: run(handlers.onReject) },
        ]
      : getHostDecisionActions(appointment, handlers);

  const secondary: RowAction[] = [];

  if (handlers.onView) {
    secondary.push({ key: "view", label: "View Details", icon: <EyeOutlined />, onSelect: run(handlers.onView) });
  }

  if (canManage && EDITABLE.includes(appointment.status)) {
    secondary.push({ key: "edit", label: "Edit", icon: <EditOutlined />, onSelect: run(handlers.onEdit) });
  }

  if (canManage && RESCHEDULABLE.includes(appointment.status)) {
    secondary.push({ key: "reschedule", label: "Reschedule", icon: <CalendarOutlined />, onSelect: run(handlers.onReschedule) });
  }

  if (canManage && EDITABLE.includes(appointment.status)) {
    secondary.push({ key: "cancel", label: "Cancel Appointment", icon: <DeleteOutlined />, danger: true, onSelect: run(handlers.onCancel) });
  }

  return { primary, secondary };
}
