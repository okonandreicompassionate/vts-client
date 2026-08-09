import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";

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

const visitorBaseQuery: BaseQueryFn<
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
      ? {
          url: tenantPath(orgSlug, args),
        }
      : {
          ...args,
          url: tenantPath(orgSlug, args.url),
        };

  return rawVisitorBaseQuery(request, api, extraOptions);
};

const getCurrentOrgSlug = () => {
  const [, orgSlug] = window.location.pathname.split("/");

  return orgSlug || "no-tenant";
};

export const visitorApi = createApi({
  reducerPath: "visitorApi",

  baseQuery: visitorBaseQuery,

  tagTypes: ["Visits"],

  serializeQueryArgs: ({ endpointName, queryArgs }) => {
    const orgSlug = getCurrentOrgSlug();

    return `${orgSlug}:${endpointName}:${JSON.stringify(
      queryArgs ?? null,
    )}`;
  },

  endpoints: () => ({}),
});