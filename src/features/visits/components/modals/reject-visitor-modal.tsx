import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Button, Checkbox, message } from "antd";
import { useState } from "react";
import CustomModal from "@/components/ui/custom-modal";
import { usePopup } from "@/features/popup/hooks/use-popup";

type RejectVisitorModalProps = {
  onConfirm?: () => void | Promise<void>;
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

  const handleConfirm = async () => {
    try {
      await onConfirm?.();
      setConfirmed(false);
      closeModal();
    } catch {
      message.error("Rejection could not be completed. Please try again.");
    }
  };

  return (
    <CustomModal width={420} onCancel={handleCancel}>
      <CustomModal.Body maxHeight={false}>
        <div className="py-6 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500 dark:bg-red-950/40">
            <ExclamationCircleOutlined className="text-3xl" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Reject Visitor</h3>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Rejecting this visitor will deny access and allow you to notify the guest of the reason.
          </p>

          <div className="mt-5 flex justify-center">
            <Checkbox
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="custom-checkbox"
            >
              <span className="text-sm text-slate-600 dark:text-slate-300">
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
            className="h-11! flex-1! rounded-full! border-slate-100! bg-slate-50! px-8! font-medium! text-slate-400! hover:bg-slate-100! hover:text-slate-500! dark:border-slate-600! dark:bg-slate-700! dark:text-slate-300! dark:hover:bg-slate-600!"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            danger
            disabled={!confirmed}
            onClick={handleConfirm}
            className="h-11! flex-1! rounded-full! border-none! bg-red-500! px-8! font-semibold! hover:bg-red-600! disabled:bg-red-200! disabled:hover:bg-red-200!"
          >
            Reject
          </Button>
        </div>
      </CustomModal.Footer>
    </CustomModal>
  );
}
