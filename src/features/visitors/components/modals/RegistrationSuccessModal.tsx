// RegistrationSuccessModal.tsx
import { Button } from "antd";
import CustomModal from "../../../../components/CustomModal"; // adjust depth
import { usePopup } from "../../../../hooks/usePopup";

type RegistrationSuccessModalProps = {
  onOk?: () => void;
  onClose?: () => void;
};

export default function RegistrationSuccessModal({ onOk, onClose }: RegistrationSuccessModalProps) {
  const { closeModal } = usePopup();

  const handleClose = () => {
    onClose?.();
    closeModal();
  };

  const handleOk = () => {
    onOk?.();
    closeModal();
  };

  return (
    <CustomModal width={340} onCancel={handleClose}>
      <CustomModal.Body>
        <div className="flex flex-col items-center pt-6 pb-2 text-center">
          <svg
            className="mb-4 h-10 w-10 text-sky-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12.5l2.5 2.5L16 9.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h3 className="text-[15px] font-medium text-slate-700">Submitted Successfully</h3>
        </div>
      </CustomModal.Body>

      <CustomModal.Footer>
        <div className="mt-5">
          <Button type="link" block onClick={handleOk} className="h-11! font-normal text-sky-500!">
            Ok
          </Button>
        </div>
      </CustomModal.Footer>
    </CustomModal>
  );
}