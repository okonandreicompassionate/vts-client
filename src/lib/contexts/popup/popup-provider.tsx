import { type ReactNode, useCallback, useMemo, useRef, useState } from "react";
import { Outlet } from "react-router-dom";

import { ConfirmModal } from "@/components/ui/confirm-modal";
import { PopupContext } from "./popup-context";
import type { ConfirmOptions, PopupContextType } from "./popup-types";

/** Open/closed state for one popup slot; content is kept until the close animation ends. */
function usePopupSlot() {
  const [content, setContent] = useState<ReactNode>(null);
  const [isOpen, setIsOpen] = useState(false);
  // Read by onClosed: a popup opened during the previous one's close animation must survive it.
  const isOpenRef = useRef(false);

  const open = useCallback((next: ReactNode) => {
    isOpenRef.current = true;
    setContent(next);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    isOpenRef.current = false;
    setIsOpen(false);
  }, []);

  const onClosed = useCallback(() => {
    if (!isOpenRef.current) setContent(null);
  }, []);

  return { content, isOpen, open, close, onClosed };
}

/**
 * One modal slot and one drawer slot for the whole app, so a modal can open
 * on top of a drawer.
 *
 * Rendered inside the router (see `PopupOutlet`), so popups can use router hooks.
 */
export function PopupProvider({ children }: { children: ReactNode }) {
  const modal = usePopupSlot();
  const drawer = usePopupSlot();
  const openModal = modal.open;

  const confirm = useCallback(
    (options: ConfirmOptions) => openModal(<ConfirmModal {...options} />),
    [openModal],
  );

  const value = useMemo<PopupContextType>(
    () => ({
      openModal,
      closeModal: modal.close,
      isModalOpen: modal.isOpen,
      onModalClosed: modal.onClosed,
      openDrawer: drawer.open,
      closeDrawer: drawer.close,
      isDrawerOpen: drawer.isOpen,
      onDrawerClosed: drawer.onClosed,
      confirm,
    }),
    [
      confirm,
      drawer.close,
      drawer.isOpen,
      drawer.onClosed,
      drawer.open,
      modal.close,
      modal.isOpen,
      modal.onClosed,
      openModal,
    ],
  );

  return (
    <PopupContext.Provider value={value}>
      {children}
      {drawer.content}
      {modal.content}
    </PopupContext.Provider>
  );
}

/** Route element that provides popups to every page below it. */
export function PopupOutlet() {
  return (
    <PopupProvider>
      <Outlet />
    </PopupProvider>
  );
}
