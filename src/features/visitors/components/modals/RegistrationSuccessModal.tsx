import { Button } from "antd";
import CustomModal from "../../../../components/CustomModal"; // adjust depth
import { usePopup } from "../../../../hooks/usePopup";

type RegistrationSuccessModalProps = {
  onOk?: () => void;
};

export default function RegistrationSuccessModal({ onOk }: RegistrationSuccessModalProps) {
  const { closeModal } = usePopup();

  const handleOk = () => {
    onOk?.();
    closeModal();
  };

  return (
    <CustomModal hideFooter closable={false} center width={340}>
      <div className="flex flex-col items-center text-center pt-2 pb-1">
        <img src="/warning-icon.svg" alt="" className="w-16 h-16 mb-5" />
        <h3 className="text-base font-semibold text-slate-800">Submitted Successfully</h3>
      </div>
      <div className="mt-6 border-t border-slate-100">
        <Button type="link" block onClick={handleOk} className="h-12! text-sky-500! font-medium">
          Ok
        </Button>
      </div>
    </CustomModal>
  );
}