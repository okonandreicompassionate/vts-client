import { ExclamationCircleOutlined } from "@ant-design/icons";
import CustomModal from "../../../../components/CustomModal";

type RejectVisitorModalProps = {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function RejectVisitorModal({
  visible,
  onConfirm,
  onCancel,
}: RejectVisitorModalProps) {
  return (
    <CustomModal
      title="Reject Visitor"
      modalSubtitle="Rejecting this visitor will deny access and allow you to notify the guest of the reason."
      okText="Reject"
      onOk={onConfirm}
      onCancel={onCancel}
      width={420}
      open={visible}
    >
      <div className="py-6 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
          <ExclamationCircleOutlined className="text-3xl" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Reject Visitor</h3>
        <p className="mt-3 text-sm text-slate-500">
          Are you sure you want to reject this visitor? This action will deny access and can notify
          the visitor.
        </p>
      </div>
    </CustomModal>
  );
}
