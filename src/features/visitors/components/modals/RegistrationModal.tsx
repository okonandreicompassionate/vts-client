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
    try {
      setSubmitting(true);
      await onSubmit();
      closeModal();
      setConfirmed(false); // reset so a reopened modal starts unchecked
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setConfirmed(false);
    onCancel?.();
    closeModal();
  };

  return (
    <CustomModal onCancel={handleCancel}>
      <CustomModal.Body>
        <div className="w-full text-left">
          <h3 className="text-lg font-semibold text-slate-900">Submit Registration?</h3>
          <p className="mt-1 text-sm text-slate-600">
            Confirm that you want to submit this registration.
          </p>

          <div className="pt-4 pb-2">
            <Checkbox checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)}>
              <span className="text-sm text-slate-600">
                I confirm that I want to proceed with this action and understand that this will be
                reviewed.
              </span>
            </Checkbox>
          </div>
        </div>
      </CustomModal.Body>

      <CustomModal.Footer>
        <div className="mt-4 flex w-full items-center gap-3">
          <Button
            onClick={handleCancel}
            disabled={submitting}
            className="!rounded-full !h-11 !px-8 !bg-white !text-slate-500 !border-slate-200 hover:!bg-slate-50 hover:!text-slate-600 !font-medium !flex-1"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            loading={submitting}
            disabled={!confirmed}
            onClick={handleConfirm}
            className="!rounded-full !h-11 !px-8 !bg-sky-500 hover:!bg-sky-600 !border-none !font-semibold !flex-1 disabled:!bg-sky-200 disabled:hover:!bg-sky-200"
          >
            Submit
          </Button>
        </div>
      </CustomModal.Footer>
    </CustomModal>
  );
}