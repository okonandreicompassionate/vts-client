import { createApi } from "@reduxjs/toolkit/query/react";
import { tenantBaseQuery } from "./tenant-base-query";

export const api = createApi({
  reducerPath: "api",
  baseQuery: tenantBaseQuery,
  tagTypes: ["Admins", "Visits"],
  endpoints: () => ({}),
});
