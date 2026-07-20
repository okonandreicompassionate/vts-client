import { CloseOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import CustomModal from "../../../../components/CustomModal";

type AccessRejectedModalProps = {
  visible: boolean;
  onClose: () => void;
  onNotify?: () => void;
  reason?: string;
  rejectedBy?: string;
  date?: string;
};

export default function AccessRejectedModal({
  visible,
  onClose,
  onNotify,
  reason = "Unauthorized purpose of visit - requires additional clearance",
  rejectedBy = "Admin User",
  date = "Oct 24, 2022 - 10:45 AM",
}: AccessRejectedModalProps) {
  return (
    <CustomModal hideFooter closable={false} center width={480} open={visible} onCancel={onClose}>
      <div className="relative pt-2 text-center">
        <Button
          onClick={onClose}
          type="text"
          shape="circle"
          icon={<CloseOutlined className="text-sm text-slate-500" />}
          className="absolute top-0 right-0 flex h-9 w-9 items-center justify-center bg-slate-100"
        />

        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <CloseCircleOutlined className="text-3xl text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Access Rejected</h3>
        <p className="mt-1.5 text-sm text-slate-400">Visitor access has been denied.</p>

        <div className="mt-6 rounded-xl bg-[#FEE2E2] px-5 py-4 text-left">
          <div className="border-b border-red-200 pb-3">
            <p className="text-sm text-[#991B1B]">Reason</p>
            <p className="mt-1 text-sm font-bold text-[#991B1B]">{reason}</p>
          </div>
          <div className="flex items-center justify-between gap-4 pt-3">
            <span className="text-sm text-[#991B1B]">Rejected By</span>
            <span className="text-sm font-bold text-[#991B1B]">{rejectedBy}</span>
          </div>
          <div className="flex items-center justify-between gap-4 pt-3">
            <span className="text-sm text-[#991B1B]">Date</span>
            <span className="text-sm font-bold text-[#991B1B]">{date}</span>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <Button
            type="link"
            onClick={onClose}
            className="h-auto! p-0! font-semibold text-[#0A96CC]!"
          >
            Back to Visitor List
          </Button>
          <Button
            type="primary"
            onClick={onNotify}
            className="h-11! rounded-lg! bg-red-500! px-6! font-semibold hover:bg-red-600!"
          >
            Notify Visitor
          </Button>
        </div>
      </div>
    </CustomModal>
  );
}