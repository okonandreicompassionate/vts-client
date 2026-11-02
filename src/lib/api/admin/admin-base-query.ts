import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

import { clearAuth } from "@/features/auth/stores/admin-auth-slice";
import { csrfFetch } from "../csrf-fetch";

// The organization comes from the session cookie, so requests carry no tenant in the URL.
const rawAdminBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL ?? "",
  credentials: "include",
  fetchFn: csrfFetch,
  timeout: 30_000,
});

let refreshPromise: Promise<boolean> | null = null;
let isSessionExpired = false;

const signInEndpoints = new Set(["Login", "microsoftLogin", "selectOrganization"]);
const nonRefreshableEndpoints = new Set([...signInEndpoints, "refresh"]);

const refreshAdminSession = async (
  api: Parameters<typeof rawAdminBaseQuery>[1],
  extraOptions: Parameters<typeof rawAdminBaseQuery>[2],
): Promise<boolean> => {
  const refreshResult = await rawAdminBaseQuery(
    { url: "/auth/refresh", method: "POST" },
    api,
    extraOptions,
  );

  return !refreshResult.error;
};

export const adminBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  if (isSessionExpired && !nonRefreshableEndpoints.has(api.endpoint)) {
    return {
      error: {
        status: 401,
        data: { message: "Your session has expired. Please sign in again." },
      },
    };
  }

  const result = await rawAdminBaseQuery(args, api, extraOptions);

  if (!result.error && signInEndpoints.has(api.endpoint)) {
    isSessionExpired = false;
  }

  const isRefreshable401 =
    result.error?.status === 401 && !nonRefreshableEndpoints.has(api.endpoint);

  if (!isRefreshable401) {
    return result;
  }

  refreshPromise ??= refreshAdminSession(api, extraOptions).finally(() => {
    refreshPromise = null;
  });

  if (!(await refreshPromise)) {
    isSessionExpired = true;
    api.dispatch(clearAuth());
    return result;
  }

  const retriedResult = await rawAdminBaseQuery(args, api, extraOptions);

  if (retriedResult.error?.status === 401) {
    api.dispatch(clearAuth());
  }

  return retriedResult;
};
