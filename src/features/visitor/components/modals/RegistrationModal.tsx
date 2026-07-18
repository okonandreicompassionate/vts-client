import { useState } from "react";
import { Checkbox } from "antd";
import CustomModal from "../../../../components/CustomModal";
import { usePopup } from "../../../../hooks/usePopup";

type RegistrationModalProps = {
  onSubmit: () => Promise<void> | void;
};

export default function RegistrationModal({ onSubmit }: RegistrationModalProps) {
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
    closeModal();
  };

  return (
    <CustomModal
      title="Submit Registration?"
      okText="Submit"
      center
      loading={submitting}
      disabled={!confirmed}
      closable={!submitting}
      onOk={handleConfirm}
      onCancel={handleCancel}
    >
      <div>Confirm that you want to submit this registration</div>
      <div className="pt-3 pb-2">
        <Checkbox checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)}>
          I confirm that I want to proceed with this action and understand that this will be reviewed.
        </Checkbox>
      </div>
    </CustomModal>
  );
}