import CustomModal from "@/components/ui/custom-modal";
import { usePopup } from "@/lib/contexts/popup/use-popup";
import { useState } from "react";

type RegistrationModalProps = {
  existingAppointment?: boolean;
  onSubmit: () => Promise<void> | void;
  onCancel?: () => void;
};

export default function RegistrationModal({
  onSubmit,
  onCancel,
  existingAppointment = false,
}: RegistrationModalProps) {
  const { closeModal } = usePopup();

  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (submitting) return;

    try {
      setSubmitting(true);
      closeModal();
      await onSubmit();
    } finally {
      setSubmitting(false);
    }
  };

  // CustomModal closes itself; this resets and tells the page.
  const handleCancel = () => {
    onCancel?.();
  };

  return (
    <CustomModal onCancel={handleCancel} disableClose={submitting}>
      <CustomModal.Header
        title={existingAppointment ? "Continue with this appointment?" : "Submit visit request?"}
        subtitle={
          existingAppointment
            ? "Your existing appointment and its approval status will be kept."
            : "Confirm that you want to submit this request."
        }
      />

      <CustomModal.Footer
        okText={existingAppointment ? "Continue" : "Submit"}
        loading={submitting}
        onOk={() => void handleConfirm()}
      />
    </CustomModal>
  );
}
