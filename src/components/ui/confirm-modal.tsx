import { useState } from "react";

import CustomModal from "@/components/ui/custom-modal";
import { usePopup } from "@/lib/contexts/popup/use-popup";
import type { ConfirmOptions } from "@/lib/contexts/popup/popup-types";

/** Confirmation dialog behind `usePopup().confirm(...)`. */
export function ConfirmModal({
  title,
  description,
  okText = "Confirm",
  cancelText = "Cancel",
  danger = false,
  onConfirm,
}: ConfirmOptions) {
  const { closeModal } = usePopup();
  const [isWorking, setIsWorking] = useState(false);

  const handleConfirm = async () => {
    setIsWorking(true);

    try {
      await onConfirm();
      closeModal();
    } catch {
      // onConfirm reports its own errors; keep the dialog open so the user can retry.
    } finally {
      setIsWorking(false);
    }
  };

  return (
    <CustomModal size="sm" disableClose={isWorking}>
      <CustomModal.Header title={title} />

      {description && (
        <CustomModal.Body scroll={false}>
          <div className="text-sm text-slate-600 dark:text-zinc-300">{description}</div>
        </CustomModal.Body>
      )}

      <CustomModal.Footer
        okText={okText}
        cancelText={cancelText}
        danger={danger}
        loading={isWorking}
        onOk={() => void handleConfirm()}
      />
    </CustomModal>
  );
}
