
import { Outlet } from "react-router-dom";

import { TenantProvider } from "./tenant-provider";

export function TenantLayout() {
  return (
    <TenantProvider>
      <Outlet />
    </TenantProvider>
  );
}