

import { createContext } from "react";

export interface TenantContextValue {
  orgSlug: string;
}

export const TenantContext = createContext<TenantContextValue | null>(null);
