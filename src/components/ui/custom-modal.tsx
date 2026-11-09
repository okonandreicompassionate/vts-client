import { CloseOutlined } from "@ant-design/icons";
import { Button, Modal, Spin } from "antd";
import { createContext, useContext, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

import { usePopup } from "@/lib/contexts/popup/use-popup";

/**
 * The one modal shell. Every popup is built from these parts, in this order:
 *
 * ```tsx
 * <CustomModal size="sm">
 *   <CustomModal.Header title="Reject appointment" subtitle="…" icon={<StopOutlined />} tone="rose" />
 *   <CustomModal.Body>…</CustomModal.Body>
 *   <CustomModal.Footer okText="Reject" danger onOk={reject} loading={isLoading} />
 * </CustomModal>
 * ```
 */

type ModalSize = "sm" | "md" | "lg";

/** sm: confirmations and results. md: short forms. lg: long forms and uploads. */
const MODAL_WIDTHS: Record<ModalSize, number> = { sm: 420, md: 480, lg: 560 };

type HeaderTone = "sky" | "emerald" | "rose" | "amber";

const toneClasses: Record<HeaderTone, string> = {
  sky: "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400",
  emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  rose: "bg-rose-50 text-rose-500 dark:bg-rose-500/10 dark:text-rose-400",
  amber: "bg-amber-50 text-amber-500 dark:bg-amber-500/10 dark:text-amber-400",
};

interface ModalCtx {
  close: () => void;
  /** True while the modal must stay open, e.g. during a request. */
  locked: boolean;
}

const ModalContext = createContext<ModalCtx | null>(null);

const useModalCtx = () => {
  const ctx = useContext(ModalContext);

  if (!ctx) {
    throw new Error("CustomModal.* must be used inside <CustomModal>");
  }

  return ctx;
};

interface RootProps {
  children: ReactNode;
  size?: ModalSize;
  /** Runs after the modal closes by Cancel, the close button, Esc or the mask. */
  onCancel?: () => void;
  /** Keep the modal open, e.g. while it saves. */
  disableClose?: boolean;
}

export const CustomModal = ({
  children,
  size = "md",
  onCancel,
  disableClose = false,
}: RootProps) => {
  const { closeModal, isModalOpen, onModalClosed } = usePopup();

  const close = () => {
    if (disableClose) return;

    closeModal();
    onCancel?.();
  };

  return (
    <ModalContext.Provider value={{ close, locked: disableClose }}>
      <Modal
        open={isModalOpen}
        onCancel={close}
        afterClose={onModalClosed}
        footer={false}
        closable={false}
        keyboard={!disableClose}
        maskClosable={!disableClose}
        width={MODAL_WIDTHS[size]}
        centered
        styles={{ body: { padding: 0 } }}
      >
        <div className="flex w-full flex-col">{children}</div>
      </Modal>
    </ModalContext.Provider>
  );
};

const ModalHeader = ({
  title,
  subtitle,
  icon,
  tone = "sky",
  closable = true,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Shown in a tinted circle before the title. */
  icon?: ReactNode;
  tone?: HeaderTone;
  closable?: boolean;
}) => {
  const { close, locked } = useModalCtx();

  return (
    <div className="flex w-full items-start justify-between gap-3">
      <div className="flex min-w-0 items-start gap-3">
        {icon && (
          <span
            className={twMerge(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
              toneClasses[tone],
            )}
          >
            {icon}
          </span>
        )}

        <div className="min-w-0 text-left">
          <h2 className="text-base font-semibold text-slate-900 dark:text-zinc-100">{title}</h2>
          {subtitle && (
            <p className="mt-0.5 text-xs leading-5 text-slate-500 dark:text-zinc-400">{subtitle}</p>
          )}
        </div>
      </div>

      {closable && (
        <Button
          type="text"
          size="small"
          aria-label="Close"
          disabled={locked}
          onClick={close}
          icon={<CloseOutlined className="text-xs" />}
          className="shrink-0 rounded-full! bg-slate-100! dark:bg-zinc-700!"
        />
      )}
    </div>
  );
};

const ModalBody = ({
  children,
  loading,
  scroll = true,
}: {
  children: ReactNode;
  loading?: boolean;
  /** Cap the height and scroll inside; turn off for short bodies with popovers (date pickers). */
  scroll?: boolean;
}) => (
  <div
    className={twMerge(
      "mt-4 w-full text-left",
      scroll && "max-h-[60vh] overflow-x-hidden overflow-y-auto",
    )}
  >
    {loading ? (
      <div className="flex flex-col items-center justify-center py-10">
        <Spin />
      </div>
    ) : (
      children
    )}
  </div>
);

const ModalFooter = ({
  okText,
  onOk,
  cancelText = "Cancel",
  onCancel,
  loading,
  disabled,
  danger,
  hideCancel,
  okTitle,
}: {
  okText: ReactNode;
  onOk: () => void;
  cancelText?: ReactNode;
  /** Defaults to closing the modal. */
  onCancel?: () => void;
  loading?: boolean;
  disabled?: boolean;
  danger?: boolean;
  hideCancel?: boolean;
  /** Tooltip on the main button, e.g. why it's disabled. */
  okTitle?: string;
}) => {
  const { close, locked } = useModalCtx();

  return (
    <div className="mt-6 flex w-full items-center gap-3">
      {!hideCancel && (
        <Button block disabled={loading || locked} onClick={onCancel ?? close}>
          {cancelText}
        </Button>
      )}

      <Button
        block
        type="primary"
        danger={danger}
        loading={loading}
        disabled={disabled}
        title={okTitle}
        onClick={onOk}
      >
        {okText}
      </Button>
    </div>
  );
};

CustomModal.Header = ModalHeader;
CustomModal.Body = ModalBody;
CustomModal.Footer = ModalFooter;

export default CustomModal;
