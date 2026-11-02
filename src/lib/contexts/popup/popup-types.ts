import type { ReactNode } from "react";

export interface PopupOptions {
  onSubmit?: () => Promise<void>;
  okText?: string;
  loading?: boolean;
}

export interface PopupContextType {
  openModal: (content: ReactNode, options?: PopupOptions) => void;
  closeModal: () => void;
  isModalOpen: boolean;
  openDrawer: (content: ReactNode, options?: PopupOptions) => void;
  closeDrawer: () => void;
  isDrawerOpen: boolean;
}
