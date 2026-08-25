import { useMemo } from "react";
import { useParams } from "react-router-dom";

import type { Organization } from "../types/organization";

export function useOrganization(): Organization {
  const { orgSlug } = useParams<{ orgSlug: string }>();

  if (!orgSlug) {
    throw new Error(
      "No organization slug found in the current route.",
    );
  }

  return useMemo(
    () => ({
      orgSlug,
    }),
    [orgSlug],
  );
}