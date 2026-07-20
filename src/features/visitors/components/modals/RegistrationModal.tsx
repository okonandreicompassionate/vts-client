import { useState } from "react";
import { Checkbox } from "antd";
import CustomModal from "../../../../components/CustomModal";
import { usePopup } from "../../../../hooks/usePopup";

type RegistrationModalProps = {
  onSubmit: () => Promise<void> | void;
  visible?: boolean;
  onCancel?: () => void;
};

export default function RegistrationModal({ onSubmit, visible, onCancel }: RegistrationModalProps) {
  const { closeModal } = usePopup();
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async () => {
    try {
      setSubmitting(true);
      await onSubmit();
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setConfirmed(false);
    onCancel?.();
    if (!onCancel) closeModal();
  };

  return (
    <CustomModal
      okText="Submit"
      center
      loading={submitting}
      disabled={!confirmed}
      closable={false}
      onOk={handleConfirm}
      onCancel={handleCancel}
      open={visible}
    >
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
    </CustomModal>
  );
}