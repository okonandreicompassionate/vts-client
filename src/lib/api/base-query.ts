// lib/api/tenant-base-query.ts

import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

import { getAccessToken } from "./auth";
import { getCurrentOrgSlug } from "../tenant/current-tenant";
import { tenantPath } from "../tenant/tenant-path";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL ?? "",

  prepareHeaders(headers) {
    const token = getAccessToken();

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

export const tenantBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const orgSlug = getCurrentOrgSlug();

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

  return rawBaseQuery(request, api, extraOptions);
};
