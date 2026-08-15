import { Outlet } from "react-router-dom";
import { PopupProvider } from "@/lib/contexts/popup/popup-provider";

export function TenantLayout() {
  return (
    <PopupProvider>
      <Outlet />
    </PopupProvider>
  );
}