// lib/tenant/tenant-provider.tsx

import { useMemo } from "react";
import { useParams } from "react-router-dom";

import { TenantContext } from "./tenant-context";

export function TenantProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { orgSlug = "" } = useParams();

  const value = useMemo(
    () => ({
      orgSlug: orgSlug.trim().toLowerCase(),
    }),
    [orgSlug],
  );

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
}
