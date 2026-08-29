import { useState } from "react";
import { Checkbox, Button } from "antd";
import CustomModal from "../../../../components/ui/custom-modal";
import { usePopup } from "@/features/popup/hooks/use-popup";

type RegistrationModalProps = {
  onSubmit: () => Promise<void> | void;
  onCancel?: () => void;
};

export default function RegistrationModal({
  onSubmit,
  onCancel,
}: RegistrationModalProps) {
  const { closeModal } = usePopup();

  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!confirmed || submitting) return;

    try {
      setSubmitting(true);
      closeModal();
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
    <CustomModal width={480}>
      <CustomModal.Body maxHeight={false}>
        <div className="w-full px-2 pt-2">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Submit Visit Request?
          </h3>

          <p className="mt-1 text-sm leading-5 text-slate-600 dark:text-slate-400">
            Confirm that you want to submit this request.
          </p>

          <div className="pt-4 pb-2">
            <Checkbox
              checked={confirmed}
              disabled={submitting}
              onChange={(e) => setConfirmed(e.target.checked)}
            >
              <span className="text-sm leading-5 text-slate-600 dark:text-slate-400">
                I confirm that I want to proceed with this action and understand
                that this request will be reviewed.
              </span>
            </Checkbox>
          </div>
        </div>
      </CustomModal.Body>

      <CustomModal.Footer>
        <div className="mt-4 flex w-full gap-3">
          <Button
            className="h-11 flex-1 rounded-full"
            disabled={submitting}
            onClick={handleCancel}
          >
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