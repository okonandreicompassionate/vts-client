import { createContext } from "react";
import type { PopupContextType } from "../types/popup";

export const PopupContext = createContext<PopupContextType | undefined>(
  undefined,
);
