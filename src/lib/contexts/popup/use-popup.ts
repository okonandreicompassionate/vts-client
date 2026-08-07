import { useContext } from "react";
import { PopupContext, type PopupContextType } from "@/lib/contexts/popup/popup-context";

export const usePopup = (): PopupContextType => {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error("usePopup must be used within a PopupProvider");
  }
  return context;
};
