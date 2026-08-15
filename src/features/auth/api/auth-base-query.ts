import {
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

import { clearAuth } from "@/features/auth/stores/admin-auth-slice";
import { tenantBaseQuery } from "@/lib/api/base-query";

export const authBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await tenantBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const requestUrl =
      typeof args === "string"
        ? args
        : args.url;

    const isLoginRequest =
      requestUrl.includes("/auth/login");

    if (!isLoginRequest) {
      api.dispatch(clearAuth());

      const [, orgSlug] = window.location.pathname.split("/");

      if (orgSlug) {
        window.location.href = `/${orgSlug}/login`;
      }
    }
  }

  return result;
};