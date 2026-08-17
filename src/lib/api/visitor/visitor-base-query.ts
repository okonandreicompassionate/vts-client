import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

import { type RootState } from "@/lib/stores/store";
import { tenantPath } from "@/lib/tenant/tenant-path";

const rawVisitorBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL ?? "",

  prepareHeaders(headers, { getState }) {
    const token = (getState() as RootState).visitorAuth.accessToken;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

export const visitorBaseQuery: BaseQueryFn<
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

  return rawVisitorBaseQuery(request, api, extraOptions);
};