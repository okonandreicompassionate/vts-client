import { CloseOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import CustomModal from "../../../../components/ui/custom-modal";
import { usePopup } from "@/features/popup/hooks/use-popup";

type AccessRejectedModalProps = {
  onClose?: () => void;
  onNotify?: () => void;
  reason?: string;
  rejectedBy?: string;
  date?: string;
};

export default function AccessRejectedModal({
  onClose,
  onNotify,
  reason = "Unauthorized purpose of visit",
  rejectedBy = "Admin",
  date = new Date().toLocaleString(),
}: AccessRejectedModalProps) {
  const { closeModal } = usePopup();

  const handleClose = () => {
    onClose?.();
    closeModal();
  };

  const handleNotify = () => {
    onNotify?.();
    closeModal();
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
            className="absolute top-0 right-0 flex h-9 w-9 items-center justify-center bg-slate-100 dark:bg-slate-700"
          />

          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-400/10">
            <CloseCircleOutlined className="text-3xl text-red-500" />
          </div>

          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Access Rejected</h3>
          <p className="mt-1.5 text-sm text-slate-400 dark:text-slate-400">Visitor access has been denied.</p>

          <div className="mt-6 rounded-xl bg-[#FEE2E2] px-5 py-4 text-left dark:bg-red-950/50">
            <div className="border-b border-red-200 pb-3 dark:border-red-900">
              <p className="text-sm text-[#991B1B] dark:text-red-200">Reason</p>
              <p className="mt-1 text-sm font-bold text-[#991B1B] dark:text-red-200">{reason}</p>
            </div>
            <div className="flex items-center justify-between gap-4 pt-3">
              <span className="text-sm text-[#991B1B] dark:text-red-200">Rejected By</span>
              <span className="text-sm font-bold text-[#991B1B] dark:text-red-200">{rejectedBy}</span>
            </div>
            <div className="flex items-center justify-between gap-4 pt-3">
              <span className="text-sm text-[#991B1B] dark:text-red-200">Date</span>
              <span className="text-sm font-bold text-[#991B1B] dark:text-red-200">{date}</span>
            </div>
          </div>
        </div>
      </CustomModal.Body>

      <CustomModal.Footer>
        <div className="mt-8 flex items-center justify-between">
          <Button
            type="link"
            onClick={handleClose}
            className="h-auto! p-0! font-semibold text-[#0A96CC]!"
          >
            Back to Visitor List
          </Button>
          <Button
            type="primary"
            onClick={handleNotify}
            className="h-11! rounded-lg! bg-red-500! px-6! font-semibold hover:bg-red-600!"
          >
            Notify Visitor
          </Button>
        </div>
      </CustomModal.Footer>
    </CustomModal>
  );
}
