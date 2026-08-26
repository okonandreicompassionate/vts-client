import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import CustomModal from "@/components/ui/custom-modal";
import { usePopup } from "@/features/popup/hooks/use-popup";

type DeleteAdminModalProps = {
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
};

export default function DeleteAdminModal({
  onConfirm,
  onCancel,
  loading = false,
}: DeleteAdminModalProps) {
  const { closeModal } = usePopup();

  const handleCancel = () => {
    onCancel?.();
    closeModal();
  };

  const handleConfirm = async () => {
    try {
      await onConfirm?.();
      closeModal();
    } catch {
      message.error(
        "Admin could not be removed. Please try again.",
      );
    }
  };

  return (
    <CustomModal width={400} onCancel={handleCancel}>
      <CustomModal.Body maxHeight={false}>
        <div className="py-4 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500 dark:bg-red-950/40">
            <ExclamationCircleOutlined className="text-2xl" />
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Remove Admin
          </h3>

          <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            Removing this admin will revoke their administrative
            access to this organization. This action cannot be undone.
          </p>
        </div>
      </CustomModal.Body>

      <CustomModal.Footer>
        <div className="mt-2 flex w-full items-center gap-2.5">
          <Button
            onClick={handleCancel}
            disabled={loading}
            className="h-9! flex-1! rounded-full! border-slate-100! bg-slate-50! px-5! text-sm! font-medium! text-slate-400! hover:bg-slate-100! hover:text-slate-500! dark:border-slate-600! dark:bg-slate-700! dark:text-slate-300! dark:hover:bg-slate-600!"
          >
            Cancel
          </Button>

          <Button
            type="primary"
            danger
            loading={loading}
            onClick={handleConfirm}
            className="h-9! flex-1! rounded-full! border-none! bg-red-500! px-5! text-sm! font-semibold! hover:bg-red-600!"
          >
            Remove Admin
          </Button>
        </div>
      </CustomModal.Footer>
    </CustomModal>
  );
}