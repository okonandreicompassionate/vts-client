import { Button, Checkbox, Modal, Spin } from "antd";
import { useState, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { usePopup } from "../hooks/usePopup";

enum ModalTheme {
  WARNING = "WARNING",
  DEFAULT = "DEFAULT",
}

interface Props {
  title?: string;
  children: ReactNode;
  okText?: string;
  onCancel?: () => void;
  onOk?: () => void;
  modalSubtitle?: string;
  icon?: ReactNode;
  loading?: boolean;
  closable?: boolean;
  isDanger?: boolean;
  width?: number;
  center?: boolean;
  disabled?: boolean;
  step?: boolean;
  showConfirmation?: boolean; // Controls checkbox visibility
  confirmationText?: string;
  modalTheme?: ModalTheme;
  hideFooter?: boolean;
  maxHeight?: boolean;
  hideCancelButton?: boolean;
  open?: boolean;
}

export const CustomModal = ({
  children,
  loading,
  onCancel,
  modalSubtitle,
  okText,
  showConfirmation,
  confirmationText,
  onOk,
  title,
  isDanger = false,
  width = 680,
  // center = false,
  disabled = false,
  modalTheme = ModalTheme.DEFAULT,
  hideFooter = false,
  maxHeight = true,
  hideCancelButton = false,
  closable = true,
  open,
}: Props) => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const { closeModal, isModalOpen } = usePopup();

  const warning = modalTheme === ModalTheme.WARNING;

  return (
    <Modal
      okText={okText || "Submit"}
      onOk={onOk}
      okButtonProps={{ danger: isDanger, disabled }}
      open={open !== undefined ? open : isModalOpen}
      onCancel={onCancel ?? closeModal}
      confirmLoading={loading}
      closable={false}
      footer={false}
      width={width}
      centered
      closeIcon={false}
    >
      <div className="flex flex-col items-center">
        {/* //Modal Header */}
        <div className="flex w-full items-center justify-between  pb-2">
          <div className="text-left">
            <p
              className={twMerge(
                "text-lg! font-semibold capitalize",
                !modalSubtitle && "text-base!",
              )}
            >
              {title}
            </p>
            {modalSubtitle && <p className="text-sm! leading-5 text-gray-600">{modalSubtitle}</p>}
          </div>

          {closable && (
            <Button
              onClick={closeModal}
              type="text"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F5FBFE] p-1"
            >
              <img src="/close.svg" alt="Close" className="h-3 w-3" />
            </Button>
          )}
        </div>

        <div
          className={twMerge(
            "h-full w-full overflow-x-hidden overflow-y-auto",
            !maxHeight ? "" : "max-h-125",
          )}
        >
          {loading ? (
            <div className="flex h-full flex-col items-center justify-center py-10">
              <Spin className="" />
            </div>
          ) : (
            children
          )}
        </div>

        {/* Confirmation Checkbox */}
        {showConfirmation && !loading && (
          <div className="w-full p-6 pt-2">
            <Checkbox
              onChange={(e) => setIsConfirmed(e.target.checked)}
              className="custom-checkbox"
              // style={{ color: "red" }}
            >
              <p className="text-sm text-gray-600">{confirmationText ?? "I confirm this action"}</p>
            </Checkbox>
          </div>
        )}

        {!hideFooter && (
          <div className="mt-2 w-full space-x-4">
            <div className="flex items-center justify-center gap-3">
              {!hideCancelButton && (
                <Button className="!bg-[#F5FBFE] h-9 w-full px-6! text-sm!" onClick={onCancel ?? closeModal}>
                  Cancel
                </Button>
              )}
              <Button
                onClick={onOk}
                loading={loading}
                type="primary"
                className={twMerge(
                  "h-9 w-full px-6! text-sm!",
                  warning && "bg-red-400! text-white!",
                )}
                disabled={disabled || (showConfirmation ? !isConfirmed : false)}
              >
                {okText ?? "Submit"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default CustomModal;