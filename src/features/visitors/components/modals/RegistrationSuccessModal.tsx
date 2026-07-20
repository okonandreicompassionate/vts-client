import { Button } from "antd";
import CustomModal from "../../../../components/CustomModal"; // adjust depth
import { usePopup } from "../../../../hooks/usePopup";

type RegistrationSuccessModalProps = {
  onOk?: () => void;
  visible?: boolean;
  onClose?: () => void;
};

export default function RegistrationSuccessModal({
  onOk,
  visible,
  onClose,
}: RegistrationSuccessModalProps) {
  const { closeModal } = usePopup();

  const handleOk = () => {
    onOk?.();
    onClose?.();
    if (!onClose) closeModal();
  };

  return (
    <CustomModal hideFooter closable={false} center width={340} open={visible}>
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
      <div className="mt-5">
        <Button type="link" block onClick={handleOk} className="h-11! font-normal text-sky-500!">
          Ok
        </Button>
      </div>
    </CustomModal>
  );
}