import { useState } from "react";
import { Checkbox, Button } from "antd";
import CustomModal from "../../../../components/CustomModal";
import { usePopup } from "../../../../hooks/usePopup";

type RegistrationModalProps = {
  onSubmit: () => Promise<void> | void;
  onCancel?: () => void;
};

export default function RegistrationModal({ onSubmit, onCancel }: RegistrationModalProps) {
  const { closeModal } = usePopup();

  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (submitting) return;

    try {
      setSubmitting(true);

      closeModal();

      // Allow this modal to unmount before opening the next one.
      await Promise.resolve();

      await onSubmit();

      setConfirmed(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (submitting) return;

    setConfirmed(false);
    onCancel?.();
    closeModal();
  };

  return (
    <CustomModal disableClose={submitting} onCancel={handleCancel}>
      <CustomModal.Body>
        <div className="w-full text-left">
          <h3 className="text-lg font-semibold text-slate-900">Submit Registration?</h3>

          <p className="mt-1 text-sm text-slate-600">
            Confirm that you want to submit this registration.
          </p>

          <div className="pt-4 pb-2">
            <Checkbox
              checked={confirmed}
              disabled={submitting}
              onChange={(e) => setConfirmed(e.target.checked)}
            >
              <span className="text-sm text-slate-600">
                I confirm that I want to proceed with this action and understand that this
                registration will be reviewed.
              </span>
            </Checkbox>
          </div>
        </div>
      </CustomModal.Body>

      <CustomModal.Footer>
        <div className="mt-4 flex w-full gap-3">
          <Button className="h-11 flex-1 rounded-full" disabled={submitting} onClick={handleCancel}>
            Cancel
          </Button>

          <Button
            type="primary"
            className="h-11 flex-1 rounded-full"
            loading={submitting}
            disabled={!confirmed || submitting}
            onClick={handleConfirm}
          >
            Submit
          </Button>
        </div>
      </CustomModal.Footer>
    </CustomModal>
  );
}
