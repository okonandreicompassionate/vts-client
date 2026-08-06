import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Button } from "antd";
import CustomModal from "../../../../components/custom-modal";
import { usePopup } from "../../../../hooks/use-popup";

type AccessDetail = {
  label: string;
  value: string;
};

type AccessApprovedModalProps = {
  onClose?: () => void; // optional notification, no longer the close mechanism
  accessDetails: AccessDetail[];
};

export default function AccessApprovedModal({ onClose, accessDetails }: AccessApprovedModalProps) {
  const { closeModal } = usePopup();

  const handleClose = () => {
    onClose?.();   // notify parent (optional)
    closeModal();  // ALWAYS close
  };

  return (
    <CustomModal width={480} onCancel={handleClose}>
      <CustomModal.Body maxHeight={false}>
        <div className="relative pt-2 text-center">
          <Button
            onClick={handleClose}
            type="text"
            shape="circle"
            icon={<CloseOutlined className="text-sm text-slate-500" />}
            className="absolute top-0 right-0 flex h-9 w-9 items-center justify-center bg-slate-100"
          />
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-emerald-500">
              <CheckOutlined className="text-lg text-emerald-500" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-slate-900">Access Approved</h3>
          <p className="mt-1.5 text-sm text-slate-400">
            Visitor access has been successfully approved.
          </p>
          <div className="mt-6 space-y-3 rounded-xl bg-[#D1FAE5] px-5 py-4 text-left">
            {accessDetails.map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-4">
                <span className="text-sm text-[#065F46]">{row.label}</span>
                <span className="text-sm font-bold text-[#065F46]">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </CustomModal.Body>

      <CustomModal.Footer>
        <Button
          block
          onClick={handleClose}
          className="mt-6 h-11! border-[#B3DEEF]! font-semibold text-[#0A96CC]!"
        >
          Cancel
        </Button>
      </CustomModal.Footer>
    </CustomModal>
  );
}