import { useMemo } from "react";
import { useParams } from "react-router-dom";

import type { TenantContext } from "./types";

export function useTenant(): TenantContext {
  const { orgSlug } = useParams<{ orgSlug: string }>();

  return useMemo(
    () => ({
      orgSlug: orgSlug?.trim().toLowerCase() ?? "",
    }),
    [orgSlug],
  );
}
