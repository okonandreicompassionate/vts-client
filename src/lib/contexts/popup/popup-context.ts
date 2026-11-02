import { createContext } from "react";
import type { PopupContextType } from "./popup-types";

export const PopupContext = createContext<PopupContextType | undefined>(
  undefined,
);
