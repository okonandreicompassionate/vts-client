import { CheckOutlined, CloseOutlined, EyeOutlined, LoginOutlined, LogoutOutlined } from "@ant-design/icons";

import type { RowAction } from "@/components/ui/row-actions";
import type { VisitorRow } from "./visits";

interface VisitorRowActionHandlers {
  /** Table rows only; a details drawer is already the view. */
  onView?: (visitor: VisitorRow) => void;
  /** Pass for reviewers: pending visits can be approved or rejected. */
  onApprove?: (visitor: VisitorRow) => void;
  onReject?: (visitor: VisitorRow) => void;
  /** Pass for gate staff. */
  onCheckIn?: (visitor: VisitorRow) => void;
  onCheckOut?: (visitor: VisitorRow) => void;
  /** An action is already running. */
  busy?: boolean;
}

/**
 * The one list of visitor actions, shared by table rows and visitor drawers:
 * what's due now (review, check in/out) is primary, viewing is secondary.
 */
export function getVisitorRowActions(
  visitor: VisitorRow,
  { onView, onApprove, onReject, onCheckIn, onCheckOut, busy = false }: VisitorRowActionHandlers,
): { primary: RowAction[]; secondary: RowAction[] } {
  const primary: RowAction[] = [];

  if (visitor.status === "Pending") {
    if (onApprove) {
      primary.push({ key: "approve", label: "Approve", icon: <CheckOutlined />, disabled: busy, onSelect: () => onApprove(visitor) });
    }
    if (onReject) {
      primary.push({ key: "reject", label: "Reject", icon: <CloseOutlined />, danger: true, disabled: busy, onSelect: () => onReject(visitor) });
    }
  }

  if (visitor.status === "Approved" && onCheckIn) {
    primary.push({ key: "check-in", label: "Check In", icon: <LoginOutlined />, disabled: busy, onSelect: () => onCheckIn(visitor) });
  }

  if (visitor.status === "Signed In" && onCheckOut) {
    primary.push({ key: "check-out", label: "Check Out", icon: <LogoutOutlined />, disabled: busy, onSelect: () => onCheckOut(visitor) });
  }

  return {
    primary,
    secondary: onView
      ? [{ key: "view", label: "View Details", icon: <EyeOutlined />, onSelect: () => onView(visitor) }]
      : [],
  };
}
