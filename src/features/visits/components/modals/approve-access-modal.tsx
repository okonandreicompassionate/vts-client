import { CloseOutlined, WarningOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import CustomModal from "../../../../components/ui/custom-modal";
import { usePopup } from "@/lib/contexts/popup/use-popup";

type ApproveAccessModalProps = {
   visitorName: string;
  purpose: string;
  hostName: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
};

export default function ApproveAccessModal({
 visitorName,
  purpose,
  hostName,
  onConfirm,
  onCancel,
}: ApproveAccessModalProps) {
  const { closeModal } = usePopup();
  const details = [
    {
      label: "Visitor Name",
      value: visitorName,
    },
    {
      label: "Purpose of Visit",
      value: purpose,
    },
    {
      label: "Host Name",
      value: hostName,
    },

  ];

  const handleCancel = () => {
    onCancel?.();
    closeModal();
  };

  const handleConfirm = async () => {
    try {
      await onConfirm?.();
      closeModal();
    } catch {
      message.error("Approval could not be completed. Please try again.");
    }
  };

  return (
    <CustomModal width={480} onCancel={handleCancel}>
      <CustomModal.Body maxHeight={false}>
        <div className="relative text-center">
          <Button
            onClick={handleCancel}
            type="text"
            shape="circle"
            icon={<CloseOutlined className="text-xs text-slate-500 dark:text-slate-300" />}
            className="absolute top-0 right-0 flex h-9 w-9 items-center justify-center bg-slate-100 dark:bg-slate-700"
          />

          <div className="mx-auto mb-1 flex h-16 w-16 items-center justify-center rounded-full border-2 border-orange-200 bg-orange-50 dark:bg-orange-950/40">
            <WarningOutlined className="text-lg! text-orange-400!" />
          </div>

          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Confirm Approval</h3>
          <p className="mx-auto mt-1 max-w-sm text-[13px] text-slate-500 dark:text-slate-400">
            You are about to grant access to the following visitor. Please review the details before
            confirming.
          </p>

          <div className="mt-4 rounded-xl bg-emerald-50 px-5 py-2 text-left dark:bg-emerald-950/30">
            {details.map((row) => (
              <div key={row.label} className="flex items-center justify-between py-1.5">
                <span className="text-xs text-emerald-700 dark:text-emerald-300">{row.label}</span>
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-200">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CustomModal.Body>
      <CustomModal.Footer>
        <div className="mt-2 w-full flex justify-center items-center gap-4">
          <Button
            onClick={handleCancel}
            className="h-11! w-full font-medium text-slate-700! dark:text-slate-200!"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            type="primary"
            className="h-11! w-full bg-emerald-500! font-semibold hover:bg-emerald-600!"
          >
            Approve Access
          </Button>
        </div>
      </CustomModal.Footer>
    </CustomModal>
  );
}
