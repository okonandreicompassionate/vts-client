import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

import { type RootState } from "../stores/store";
import { clearAdminAuth } from "../../features/admins/stores/auth-slice";
import { tenantPath } from "../tenant/tenant-path";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL ?? "",

  prepareHeaders(headers, { getState }) {
    const token = (getState() as RootState).adminAuth.token;

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

  const result = await rawBaseQuery(request, api, extraOptions);

  
  if (result.error?.status === 401) {
    api.dispatch(clearAdminAuth());

    window.location.href = `/${orgSlug}/auth/login`;
  }

  return result;
};