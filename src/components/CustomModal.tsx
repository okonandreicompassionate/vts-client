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
}: Props) => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const { closeModal, isModalOpen } = usePopup();

  const warning = modalTheme === ModalTheme.WARNING;

  return (
    <Modal
      okText={okText || "Submit"}
      onOk={onOk}
      okButtonProps={{ danger: isDanger, disabled }}
      open={isModalOpen}
      onCancel={closeModal}
      confirmLoading={loading}
      closable={false}
      footer={false}
      width={width}
      centered
      closeIcon={false}
    >
      <div className="flex flex-col items-center">
        {/* //Modal Header */}
        <div className="w-full flex items-center justify-between border-b pb-2 border-gray-300 ">
          <div className="text-left">
            <p
              className={twMerge(
                "font-semibold capitalize text-lg!",
                !modalSubtitle && "text-base!",
              )}
            >
              {title}
            </p>
            {modalSubtitle && (
              <p className="text-gray-600 text-sm! leading-5">
                {modalSubtitle}
              </p>
            )}
          </div>

          <Button
            onClick={closeModal}
            type="text"
            className="flex items-center justify-center bg-green-50 p-1 rounded-full h-7 w-7"
          >
            X
          </Button>
        </div>

        <div
          className={twMerge(
            "w-full h-full overflow-y-auto overflow-x-hidden",
            !maxHeight ? "" : "max-h-125",
          )}
        >
          {loading ? (
            <div className="h-full flex flex-col justify-center items-center py-10">
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
              <p className="text-sm text-gray-600">
                {confirmationText ?? "I confirm this action"}
              </p>
            </Checkbox>
          </div>
        )}

        {!hideFooter && (
          <div className="space-x-4 w-full mt-2">
            <div className="flex items-center justify-center gap-3">
              {!hideCancelButton && (
                <Button
                  className="text-sm! px-6! w-full h-9"
                  onClick={onCancel ?? closeModal}
                >
                  Cancel
                </Button>
              )}
              <Button
                onClick={onOk}
                loading={loading}
                type="primary"
                className={twMerge(
                  "text-sm! px-6! w-full h-9",
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
