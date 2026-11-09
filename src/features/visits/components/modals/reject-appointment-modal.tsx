import { StopOutlined } from "@ant-design/icons";
import { Input, message } from "antd";
import { useState } from "react";

import CustomModal from "@/components/ui/custom-modal";
import { usePopup } from "@/lib/contexts/popup/use-popup";
import { getVisitActionErrorMessage } from "@/utils/visit-action-error";
import { useRejectVisitMutation } from "../../api/admins-visit-api-slice";
import { useRefetchVisitLists } from "../../hooks/use-refetch-visit-lists";
import type { VisitorRow } from "../../utils/visits";

/** Reject with a required reason. Open with `openModal(<RejectAppointmentModal appointment={row} />)`. */
export default function RejectAppointmentModal({
  appointment,
  initialReason = "",
  onRejected,
}: {
  appointment: VisitorRow;
  /** Prefill, e.g. notes already typed on the visitor's page. */
  initialReason?: string;
  onRejected?: () => void;
}) {
  const { closeModal } = usePopup();
  const refetchVisitLists = useRefetchVisitLists();
  const [rejectVisit, { isLoading }] = useRejectVisitMutation();
  const [reason, setReason] = useState(initialReason);

  const handleReject = async () => {
    if (!reason.trim()) return;

    try {
      await rejectVisit({ id: appointment.id, reason: reason.trim() }).unwrap();
      message.success("Appointment rejected.");
      await refetchVisitLists();
      onRejected?.();
      closeModal();
    } catch (error) {
      message.error(
        getVisitActionErrorMessage(
          error,
          "The appointment could not be updated. Please try again.",
        ),
      );
    }
  };

  return (
    <CustomModal size="sm" disableClose={isLoading}>
      <CustomModal.Header
        title="Reject appointment"
        subtitle={`Tell ${appointment.name} why their appointment was rejected.`}
        icon={<StopOutlined />}
        tone="rose"
      />

      <CustomModal.Body scroll={false}>
        <Input.TextArea
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Enter rejection reason"
          rows={4}
          maxLength={500}
          showCount
        />
      </CustomModal.Body>

      <CustomModal.Footer
        okText="Reject appointment"
        danger
        loading={isLoading}
        disabled={!reason.trim()}
        onOk={() => void handleReject()}
      />
    </CustomModal>
  );
}
