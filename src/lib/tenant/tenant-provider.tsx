import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";

import { TenantContext } from "./tenant-context";
import { setCurrentOrgSlug } from "./current";

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

  useEffect(() => {
    setCurrentOrgSlug(value.orgSlug);
  }, [value.orgSlug]);

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
}
