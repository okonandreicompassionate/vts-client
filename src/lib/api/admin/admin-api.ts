import { createApi } from "@reduxjs/toolkit/query/react";

import { adminBaseQuery } from "./admin-base-query";

const getCurrentOrgSlug = () => {
  const [, orgSlug] = window.location.pathname.split("/");

  return orgSlug || "no-tenant";
};

export const adminApi = createApi({
  reducerPath: "adminApi",

  baseQuery: adminBaseQuery,

  tagTypes: [
    "Settings",
    "Visits",
    "Employees",
    "Notifications",
    "Users",
  ],

  serializeQueryArgs: ({ endpointName, queryArgs }) => {
    const orgSlug = getCurrentOrgSlug();

    return `${orgSlug}:${endpointName}:${JSON.stringify(
      queryArgs ?? null,
    )}`;
  },

  endpoints: () => ({}),
});