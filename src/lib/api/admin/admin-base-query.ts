import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

import { tenantPath } from "@/lib/tenant/tenant-path";
import { clearAuth } from "@/features/auth/stores/admin-auth-slice";

const rawAdminBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL ?? "",
  credentials: "include",
});

let refreshPromise: Promise<boolean> | null = null;

const nonRefreshableEndpoints = new Set([
  "Login",
  "microsoftLogin",
  "refresh",
]);

const clearAdminSession = (api: Parameters<typeof rawAdminBaseQuery>[1]) => {
  api.dispatch(clearAuth());
  api.dispatch({ type: "adminApi/resetApiState" });
};

const refreshAdminSession = async (
  orgSlug: string,
  api: Parameters<typeof rawAdminBaseQuery>[1],
  extraOptions: Parameters<typeof rawAdminBaseQuery>[2],
): Promise<boolean> => {
  const refreshResult = await rawAdminBaseQuery(
    {
      url: tenantPath(orgSlug, "/auth/refresh"),
      method: "POST",
    },
    api,
    extraOptions,
  );

  return !refreshResult.error;
};

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

  const isRefreshable401 =
    result.error?.status === 401 &&
    !nonRefreshableEndpoints.has(api.endpoint);

  if (isRefreshable401) {
    refreshPromise ??= refreshAdminSession(
      orgSlug,
      api,
      extraOptions,
    ).finally(() => {
      refreshPromise = null;
    });

    if (!(await refreshPromise)) {
      clearAdminSession(api);
      return result;
    }

    const retriedResult = await rawAdminBaseQuery(
      request,
      api,
      extraOptions,
    );

    if (retriedResult.error?.status === 401) {
      clearAdminSession(api);
    }

    return retriedResult;
  }

  return result;
};