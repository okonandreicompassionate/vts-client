import { useMemo } from "react";
import { useParams } from "react-router-dom";

import type { Organization } from "../types/organization";
import { useGetPublicOrganizationQuery } from "../api/organizations-api-slice";

export function useOrganization(): Organization {
  const { orgSlug } = useParams<{ orgSlug: string }>();
  const { data } = useGetPublicOrganizationQuery(orgSlug ?? "", { skip: !orgSlug });

  if (!orgSlug) {
    throw new Error("No organization slug found in the current route.");
  }

  return useMemo(
    () => ({
      orgSlug,
      requireVisitorEmailVerification: data?.requireVisitorEmailVerification ?? true,
    }),
    [orgSlug, data?.requireVisitorEmailVerification],
  );
}
