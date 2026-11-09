import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

import { clearAuth } from "@/features/auth/stores/admin-auth-slice";
import { csrfFetch } from "./csrf-fetch";

// Session cookies (staff or visitor) identify the user and organization, so
// requests carry no tenant in the URL except public visitor links (/v/:orgSlug).
const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL ?? "",
  credentials: "include",
  fetchFn: csrfFetch,
  timeout: 30_000,
});

type ApiArgs = Parameters<typeof rawBaseQuery>;

let refreshPromise: Promise<boolean> | null = null;
let isStaffSessionExpired = false;

const signInEndpoints = new Set(["Login", "microsoftLogin", "selectOrganization"]);
const nonRefreshableEndpoints = new Set([...signInEndpoints, "refresh"]);

/** Visitor and public calls use their own (or no) session, never the staff refresh token. */
const isVisitorOrPublicRequest = (args: string | FetchArgs) => {
  const url = typeof args === "string" ? args : args.url;

  return url.startsWith("/v/") || url.startsWith("/visitor") || url.startsWith("/auth/join");
};

const refreshStaffSession = async (api: ApiArgs[1], extraOptions: ApiArgs[2]) => {
  const result = await rawBaseQuery({ url: "/auth/refresh", method: "POST" }, api, extraOptions);

  return !result.error;
};

/**
 * One base query for every caller. Staff requests that get a 401 refresh the
 * staff session once and retry; if refreshing fails, the staff session is
 * cleared and later staff requests fail fast until the next sign-in.
 */
export const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  const isStaffRequest = !isVisitorOrPublicRequest(args);

  if (isStaffRequest && isStaffSessionExpired && !nonRefreshableEndpoints.has(api.endpoint)) {
    return {
      error: {
        status: 401,
        data: { message: "Your session has expired. Please sign in again." },
      },
    };
  }

  const result = await rawBaseQuery(args, api, extraOptions);

  if (!result.error && signInEndpoints.has(api.endpoint)) {
    isStaffSessionExpired = false;
  }

  const shouldRefresh =
    isStaffRequest && result.error?.status === 401 && !nonRefreshableEndpoints.has(api.endpoint);

  if (!shouldRefresh) {
    return result;
  }

  refreshPromise ??= refreshStaffSession(api, extraOptions).finally(() => {
    refreshPromise = null;
  });

  if (!(await refreshPromise)) {
    isStaffSessionExpired = true;
    api.dispatch(clearAuth());
    return result;
  }

  const retried = await rawBaseQuery(args, api, extraOptions);

  if (retried.error?.status === 401) {
    api.dispatch(clearAuth());
  }

  return retried;
};
