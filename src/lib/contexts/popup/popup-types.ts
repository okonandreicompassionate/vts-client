import type { ReactNode } from "react";

export interface ConfirmOptions {
  title: string;
  description?: ReactNode;
  okText?: string;
  cancelText?: string;
  /** Red confirm button, for destructive actions. */
  danger?: boolean;
  /** Runs when confirmed. The dialog shows a spinner until it settles and stays open if it throws. */
  onConfirm: () => Promise<unknown> | unknown;
}

export interface PopupContextType {
  /** Shows `content` (usually a `<CustomModal>`) in the app's single modal slot. */
  openModal: (content: ReactNode) => void;
  closeModal: () => void;
  isModalOpen: boolean;
  /** Shows `content` (usually a `<CustomDrawer>`) in the app's single drawer slot. */
  openDrawer: (content: ReactNode) => void;
  closeDrawer: () => void;
  isDrawerOpen: boolean;
  /** A themed confirmation dialog; replaces antd's static `Modal.confirm`. */
  confirm: (options: ConfirmOptions) => void;
  /** Called by CustomModal/CustomDrawer once their close animation ends. */
  onModalClosed: () => void;
  onDrawerClosed: () => void;
}
