import { type ReactNode, useState } from "react";
import { PopupContext } from "./popup-context";

export function PopupProvider({ children }: { children: ReactNode }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode>(null);
  const [drawerContent, setDrawerContent] = useState<ReactNode>(null);

  const openModal = (content: ReactNode) => {
    setModalContent(content);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalContent(null);
  };

  const openDrawer = (content: ReactNode) => {
    setDrawerContent(content);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setDrawerContent(null);
  };

  return (
    <PopupContext.Provider
      value={{
        openModal,
        closeModal,
        isModalOpen,
        openDrawer,
        closeDrawer,
        isDrawerOpen,
      }}
    >
      {children}
      {modalContent}
      {drawerContent}
    </PopupContext.Provider>
  );
}
