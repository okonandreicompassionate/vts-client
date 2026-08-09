import {
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

import { clearAdminAuth } from "@/features/admins/stores/admin-auth-slice";
import { tenantBaseQuery } from "@/lib/api/base-query";

export const adminBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await tenantBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    api.dispatch(clearAdminAuth());

    const [, orgSlug] = window.location.pathname.split("/");

    if (orgSlug) {
      window.location.href = `/${orgSlug}/admin`;
    }
  }

  return result;
};