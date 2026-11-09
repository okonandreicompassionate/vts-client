import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "./base-query";

/**
 * The app's single RTK Query API, shared by staff, visitor and public screens.
 * Features add endpoints with `api.injectEndpoints`. The cache is reset on
 * sign-in and sign-out, so data never outlives the session it was fetched for.
 */
export const api = createApi({
  reducerPath: "api",

  baseQuery,

  tagTypes: ["Settings", "Visits", "Employees", "Notifications", "Users", "Admins", "Organization"],

  endpoints: () => ({}),
});
