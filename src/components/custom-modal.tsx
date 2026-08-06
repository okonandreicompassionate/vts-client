import { Button, Checkbox, Modal, Spin } from "antd";
import { createContext, useContext, useState, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { usePopup } from "../hooks/use-popup";

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
  open?: boolean;
  width?: number;
  onCancel?: () => void;
  disableClose?: boolean;
}

export const CustomModal = ({
  children,
  open,
  width = 680,
  onCancel,
  disableClose = false,
}: RootProps) => {
  const { closeModal, isModalOpen } = usePopup();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const close = () => {
    if (disableClose) return;
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
        keyboard={!disableClose}
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
            {subtitle && (
              <p className="text-sm! leading-5 text-gray-600 dark:text-slate-400">{subtitle}</p>
            )}
          </>
        )}
      </div>
      {closable && (
        <Button
          onClick={close}
          type="text"
          className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F5FBFE] p-1 dark:bg-slate-700"
        >
          <img src="/close.svg" alt="Close" className="h-3 w-3 dark:invert" />
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

CustomModal.Confirmation = ({ text }: { text?: string }) => {
  const { setIsConfirmed } = UseModalCtx();
  return (
    <div className="w-full p-6 pt-2">
      <Checkbox onChange={(e) => setIsConfirmed(e.target.checked)} className="custom-checkbox">
        <p className="text-sm text-gray-600 dark:text-slate-400">
          {text ?? "I confirm this action"}
        </p>
      </Checkbox>
    </div>
  );
};

CustomModal.Footer = ({
  okText = "Submit",
  onOk,
  onCancel,
  loading,
  disabled,
  danger,
  requireConfirmation,
  hideCancel,
  children,
}: {
  okText?: string;
  onOk?: () => void;
  onCancel?: () => void;
  loading?: boolean;
  disabled?: boolean;
  danger?: boolean;
  requireConfirmation?: boolean;
  hideCancel?: boolean;
  children?: ReactNode; // escape hatch: pass fully custom footer JSX
}) => {
  const { close, isConfirmed } = UseModalCtx();

  if (children) {
    return <div className="mt-2 flex w-full items-center justify-center gap-3">{children}</div>;
  }
  return (
    <div className="mt-2 flex w-full items-center justify-center gap-3">
      {!hideCancel && (
        <Button className="h-9 w-full !bg-[#F5FBFE] px-6! text-sm!" onClick={onCancel ?? close}>
          Cancel
        </Button>
      )}
      <Button
        onClick={onOk}
        loading={loading}
        type="primary"
        className={twMerge("h-9 w-full px-6! text-sm!", danger && "bg-red-400! text-white!")}
        disabled={disabled || (requireConfirmation ? !isConfirmed : false)}
      >
        {okText}
      </Button>
    </div>
  );
};

export default CustomModal;
