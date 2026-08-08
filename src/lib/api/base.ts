import { createApi } from "@reduxjs/toolkit/query/react";

import { adminBaseQuery } from "../../features/admins/api/admin-base";

const getCurrentOrgSlug = () => {
  const [, orgSlug] = window.location.pathname.split("/");

  return orgSlug || "no-tenant";
};

export const api = createApi({
  reducerPath: "api",

  baseQuery: adminBaseQuery,

  tagTypes: ["Admins", "Visits"],

  serializeQueryArgs: ({ endpointName, queryArgs }) => {
    const orgSlug = getCurrentOrgSlug();

    return `${orgSlug}:${endpointName}:${JSON.stringify(queryArgs ?? null)}`;
  },

  endpoints: () => ({}),
});