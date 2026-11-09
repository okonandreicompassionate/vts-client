import { CheckCircleOutlined, StopOutlined } from "@ant-design/icons";
import { Input, message } from "antd";
import { useState } from "react";

import CustomModal from "@/components/ui/custom-modal";
import { usePopup } from "@/lib/contexts/popup/use-popup";
import { getVisitActionErrorMessage } from "@/utils/visit-action-error";
import { useHostDecideVisitMutation } from "../../api/admins-visit-api-slice";
import type { VisitorRow } from "../../utils/visits";

/**
 * The host approves or declines a visit with an optional note. A reviewer still
 * makes the final call. Open with `openModal(<HostDecisionModal … />)`.
 */
export default function HostDecisionModal({
  appointment,
  decision,
  onDone,
}: {
  appointment: VisitorRow;
  decision: "APPROVED" | "REJECTED";
  onDone?: () => void;
}) {
  const { closeModal } = usePopup();
  const [hostDecide, { isLoading }] = useHostDecideVisitMutation();
  const [note, setNote] = useState("");
  const approving = decision === "APPROVED";

  const handleSubmit = async () => {
    try {
      await hostDecide({ id: appointment.id, decision, note: note.trim() || undefined }).unwrap();
      message.success(
        approving
          ? "Thanks. The visit now goes to an admin for final approval."
          : "Visit declined. An admin will make the final decision.",
      );
      onDone?.();
      closeModal();
    } catch (error) {
      message.error(
        getVisitActionErrorMessage(error, "Your answer could not be saved. Please try again."),
      );
    }
  };

  return (
    <CustomModal size="sm" disableClose={isLoading}>
      <CustomModal.Header
        title={approving ? `Approve ${appointment.name}'s visit?` : `Decline ${appointment.name}'s visit?`}
        subtitle="An admin gives the final approval and may decide otherwise."
        icon={approving ? <CheckCircleOutlined /> : <StopOutlined />}
        tone={approving ? "emerald" : "rose"}
      />

      <CustomModal.Body scroll={false}>
        <Input.TextArea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder={
            approving ? "Note for the admin (optional)" : "Why are you declining? (optional)"
          }
          rows={3}
          maxLength={500}
          showCount
        />
      </CustomModal.Body>

      <CustomModal.Footer
        okText={approving ? "Approve" : "Decline"}
        danger={!approving}
        loading={isLoading}
        onOk={() => void handleSubmit()}
      />
    </CustomModal>
  );
}
