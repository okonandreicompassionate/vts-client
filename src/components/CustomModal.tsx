import { Button, Checkbox, Modal, Spin } from "antd";
import { useState, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { usePopup } from "../hooks/usePopup";

// shared state so Confirmation + Footer can talk without prop threading
interface ModalCtx {
  close: () => void;
  isConfirmed: boolean;
  setIsConfirmed: (v: boolean) => void;
}
const ModalContext = createContext<ModalCtx | null>(null);
const UseModalCtx = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("CustomModal.* must be used inside <CustomModal>");
  return ctx;
};

interface RootProps {
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
  const close = () => {
    closeModal();
    onCancel?.();
  };

  return (
    <ModalContext.Provider value={{ close, isConfirmed, setIsConfirmed }}>
      <Modal
        open={open !== undefined ? open : isModalOpen}
        onCancel={close}
        footer={false}
        closable={false}
        closeIcon={false}
        width={width}
        centered
      >
        <div className="flex flex-col items-center">{children}</div>
      </Modal>
    </ModalContext.Provider>
  );
};

CustomModal.Header = ({
  title,
  subtitle,
  closable = true,
  children,
}: {
  title?: string;
  subtitle?: string;
  closable?: boolean;
  children?: ReactNode; // escape hatch: pass fully custom header JSX
}) => {
  const { close } = UseModalCtx();
  return (
    <div className="flex w-full items-center justify-between pb-2">
      <div className="text-left">
        {children ?? (
          <>
            <p className={twMerge("text-lg! font-semibold capitalize", !subtitle && "text-base!")}>
              {title}
            </p>
            {subtitle && <p className="text-sm! leading-5 text-gray-600">{subtitle}</p>}
          </>
        )}
      </div>
      {closable && (
        <Button
          onClick={close}
          type="text"
          className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F5FBFE] p-1"
        >
          <img src="/close.svg" alt="Close" className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};

CustomModal.Body = ({
  children,
  loading,
  maxHeight = true,
}: {
  children: ReactNode;
  loading?: boolean;
  maxHeight?: boolean;
}) => (
  <div
    className={twMerge("h-full w-full overflow-x-hidden overflow-y-auto", maxHeight && "max-h-125")}
  >
    {loading ? (
      <div className="flex h-full flex-col items-center justify-center py-10">
        <Spin />
      </div>
    ) : (
      children
    )}
  </div>
);

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
