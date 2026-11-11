import { CheckOutlined, CloseOutlined, LoginOutlined, LogoutOutlined } from "@ant-design/icons";

import CustomDrawer from "@/components/ui/custom-drawer";
import type { RowAction } from "@/components/ui/row-actions";
import { useAdminAuthSession } from "@/features/auth/hooks/use-auth-session";
import { usePopup } from "@/lib/contexts/popup/use-popup";
import { checkInRoles, checkOutRoles, hasRole, reviewerRoles } from "@/types/user-role";
import { useVisitorCheckActions } from "../../hooks/use-visitor-check-actions";
import { useVisitorDetails } from "../../hooks/use-visitor-details";
import RejectAppointmentModal from "../modals/reject-appointment-modal";
import VisitorDetails from "../visitor-details";

/**
 * Full visit details (timeline) in a drawer, with the visit's actions in the
 * header menu. Open with `openDrawer(<VisitorDetailsDrawer visitorId={id} />)`.
 */
export default function VisitorDetailsDrawer({ visitorId }: { visitorId: string }) {
  const { closeDrawer, openModal } = usePopup();
  const { data: currentUser } = useAdminAuthSession();
  const { visitor } = useVisitorDetails(visitorId);
  const { confirmApprove, confirmCheckIn, confirmCheckOut } = useVisitorCheckActions();

  // The drawer would show the old status once an action succeeds.
  const done = { onDone: closeDrawer };
  const primary: RowAction[] = [];

  if (visitor?.status === "Pending" && hasRole(currentUser?.role, reviewerRoles)) {
    primary.push(
      {
        key: "approve",
        label: "Approve",
        icon: <CheckOutlined />,
        onSelect: () => confirmApprove(visitor, done),
      },
      {
        key: "reject",
        label: "Reject",
        icon: <CloseOutlined />,
        danger: true,
        onSelect: () => {
          closeDrawer();
          openModal(<RejectAppointmentModal appointment={visitor} />);
        },
      },
    );
  }

  if (visitor?.status === "Approved" && hasRole(currentUser?.role, checkInRoles)) {
    primary.push({
      key: "check-in",
      label: "Check In",
      icon: <LoginOutlined />,
      onSelect: () => confirmCheckIn(visitor, done),
    });
  }
  if (visitor?.status === "Signed In" && hasRole(currentUser?.role, checkOutRoles)) {
    primary.push({
      key: "check-out",
      label: "Check Out",
      icon: <LogoutOutlined />,
      onSelect: () => confirmCheckOut(visitor, done),
    });
  }

  return (
    <CustomDrawer
      title="Visitor Details"
      width="min(100vw, 420px)"
      flush
      actionsLabel={visitor?.name}
      actions={{ primary }}
    >
      <VisitorDetails visitorId={visitorId} onClose={closeDrawer} />
    </CustomDrawer>
  );
}
