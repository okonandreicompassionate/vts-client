import { useContext } from "react";
import { PopupContext } from "../components/popup-context";
import type { PopupContextType } from "../types/popup";

export const usePopup = (): PopupContextType => {
  const context = useContext(PopupContext);

  if (!context) {
    throw new Error("usePopup must be used within a PopupProvider");
  }

  return context;
};
