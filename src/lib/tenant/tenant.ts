import { useMemo } from "react";
import { useParams } from "react-router-dom";

export interface Tenant {
  orgSlug: string;
}

export function useTenant(): Tenant {
  const { orgSlug } = useParams<{ orgSlug: string }>();

  if (!orgSlug) {
    throw new Error(
      "No organization slug found in the current route."
    );
  }

  return useMemo(
    () => ({
      orgSlug,
    }),
    [orgSlug]
  );
}