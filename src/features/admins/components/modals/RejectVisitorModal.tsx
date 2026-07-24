import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Button, Checkbox } from "antd";
import { useState } from "react";
import CustomModal from "../../../../components/CustomModal";
import { usePopup } from "../../../../hooks/usePopup";

type RejectVisitorModalProps = {
  onConfirm?: () => void;
  onCancel?: () => void;
};

export default function RejectVisitorModal({ onConfirm, onCancel }: RejectVisitorModalProps) {
  const { closeModal } = usePopup();
  const [confirmed, setConfirmed] = useState(false);

  const handleCancel = () => {
    setConfirmed(false);
    onCancel?.();
    closeModal();
  };

  const handleConfirm = () => {
    setConfirmed(false);
    onConfirm?.();
    closeModal();
  };

  return (
    <CustomModal width={420} onCancel={handleCancel}>
      <CustomModal.Body maxHeight={false}>
        <div className="py-6 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
            <ExclamationCircleOutlined className="text-3xl" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Reject Visitor</h3>
          <p className="mt-3 text-sm text-slate-500">
            Rejecting this visitor will deny access and allow you to notify the guest of the reason.
          </p>

          <div className="mt-5 flex justify-center">
            <Checkbox
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="custom-checkbox"
            >
              <span className="text-sm text-slate-600">
                I understand this will deny the visitor access.
              </span>
            </Checkbox>
          </div>
        </div>
      </CustomModal.Body>

      <CustomModal.Footer>
        <div className="mt-4 flex w-full items-center gap-3">
          <Button
            onClick={handleCancel}
            className="rounded-full! h-11! px-8! bg-slate-50! text-slate-400! border-slate-100! hover:bg-slate-100! hover:text-slate-500! font-medium! flex-1!"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            danger
            disabled={!confirmed}
            onClick={handleConfirm}
            className="rounded-full! h-11! px-8! bg-red-500! hover:bg-red-600! border-none! font-semibold! flex-1! disabled:bg-red-200! disabled:hover:bg-red-200!"
          >
            Reject
          </Button>
        </div>
      </CustomModal.Footer>
    </CustomModal>
  );
}