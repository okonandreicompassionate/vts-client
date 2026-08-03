
import { Outlet } from "react-router-dom";

import { TenantProvider } from "../lib/tenant/tenant-provider";

export function TenantLayout() {
  return (
    <TenantProvider>
      <Outlet />
    </TenantProvider>
  );
}