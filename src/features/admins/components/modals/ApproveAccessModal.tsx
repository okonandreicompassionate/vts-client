import { CloseOutlined, WarningOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import CustomModal from "../../../../components/CustomModal";
import { usePopup } from "../../../../hooks/usePopup";

type ApproveAccessModalProps = {
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  visitorName?: string;
  accessLevel?: string;
  validUntil?: string;
  entryPoint?: string;
};

export default function ApproveAccessModal({
  onConfirm,
  onCancel,
  visitorName = "Visitor",
  accessLevel = "Standard Visitor",
  validUntil = "N/A",
  entryPoint = "Main Entrance",
}: ApproveAccessModalProps) {
  const { closeModal } = usePopup();
  const details = [
    { label: "Visitor Name", value: visitorName },
    { label: "Access Level", value: accessLevel },
    { label: "Valid Until", value: validUntil },
    { label: "Entry Point", value: entryPoint },
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
        <div className="relative py-2 text-center">
          <Button
            onClick={handleCancel}
            type="text"
            shape="circle"
            icon={<CloseOutlined className="text-sm text-slate-500" />}
            className="absolute top-0 right-0 flex h-9 w-9 items-center justify-center bg-slate-100"
          />

          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border-2 border-orange-400 bg-orange-50">
            <WarningOutlined className="text-2xl text-orange-500" />
          </div>

          <h3 className="text-xl font-bold text-slate-900">Confirm Approval</h3>
          <p className="mx-auto mt-3 max-w-sm text-sm text-slate-500">
            You are about to grant access to the following visitor. Please review the details before
            confirming.
          </p>

          <div className="mt-6 rounded-xl bg-emerald-50 px-5 py-4 text-left">
            {details.map((row) => (
              <div key={row.label} className="flex items-center justify-between py-1.5">
                <span className="text-sm text-emerald-700">{row.label}</span>
                <span className="text-sm font-semibold text-emerald-800">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </CustomModal.Body>
      <CustomModal.Footer>
        <div className="mt-6 flex items-center gap-3">
          <Button onClick={handleCancel} className="h-11! w-full font-medium text-slate-700!">
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
