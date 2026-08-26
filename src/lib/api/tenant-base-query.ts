import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

import { organizationPath } from "@/features/organizations";
import { csrfFetch } from "./csrf-fetch";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL ?? "",
  credentials: "include",
  fetchFn: csrfFetch,
});

export const tenantBaseQuery: BaseQueryFn<
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
      ? organizationPath(orgSlug, args)
      : {
          ...args,
          url: organizationPath(orgSlug, args.url),
        };

  return rawBaseQuery(request, api, extraOptions);
};