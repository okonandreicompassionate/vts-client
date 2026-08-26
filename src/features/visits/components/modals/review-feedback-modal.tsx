import CustomModal from "../../../../components/ui/custom-modal";
import { usePopup } from "@/features/popup/hooks/use-popup";

type ReviewFeedBackModalProps = {
  onClose?: () => void;
};

const ReviewFeedBackModal = ({ onClose }: ReviewFeedBackModalProps) => {
  const { closeModal } = usePopup();

  const handleClose = () => {
    onClose?.();
    closeModal();
  };

  return (
    <CustomModal onCancel={handleClose}>
      <CustomModal.Header title="Review Feedback" />
      <CustomModal.Body>
        <div className="px-2 py-3 text-sm text-slate-600">Feedback content goes here.</div>
      </CustomModal.Body>
    </CustomModal>
  );
};

export default ReviewFeedBackModal;