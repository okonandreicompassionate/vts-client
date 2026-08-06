import { createContext, type ReactNode } from "react";

interface PopupOptions {
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

export const PopupContext = createContext<PopupContextType | undefined>(
  undefined,
);
