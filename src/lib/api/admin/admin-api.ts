import { createApi } from "@reduxjs/toolkit/query/react";

import { adminBaseQuery } from "./admin-base-query";

// The cache is reset on sign-in and sign-out, so entries never outlive the
// organization they were fetched for.
export const adminApi = createApi({
  reducerPath: "adminApi",

  baseQuery: adminBaseQuery,

  tagTypes: [
    "Settings",
    "Visits",
    "Employees",
    "Notifications",
    "Users",
    "Admins",
  ],

  endpoints: () => ({}),
});
