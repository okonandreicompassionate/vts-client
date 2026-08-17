import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

import { clearAuth } from "@/features/auth/stores/admin-auth-slice";
import { type RootState } from "@/lib/stores/store";
import { tenantPath } from "@/lib/tenant/tenant-path";

const rawAdminBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL ?? "",

  prepareHeaders(headers, { getState }) {
    const token = (getState() as RootState).adminAuth.token;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

export const adminBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const [, orgSlug] = window.location.pathname.split("/");

  if (!orgSlug) {
    return {
      error: {
        status: "CUSTOM_ERROR",
        error: "No active tenant found.",
      },
    };
  }

  const request =
    typeof args === "string"
      ? tenantPath(orgSlug, args)
      : {
          ...args,
          url: tenantPath(orgSlug, args.url),
        };

  const result = await rawAdminBaseQuery(
    request,
    api,
    extraOptions,
  );

  if (result.error?.status === 401) {
    const requestUrl =
      typeof args === "string"
        ? args
        : args.url;

    const isLoginRequest =
      requestUrl.includes("/auth/login");

    if (!isLoginRequest) {
      api.dispatch(clearAuth());

      window.location.href = `/${orgSlug}/login`;
    }
  }

  return result;
};