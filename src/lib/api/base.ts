import { createApi } from "@reduxjs/toolkit/query/react";

import { tenantBaseQuery } from "../api/base-query";

const getCurrentOrgSlug = () => {
  const [, orgSlug] = window.location.pathname.split("/");

  return orgSlug || "no-tenant";
};

export const api = createApi({
  reducerPath: "api",

  baseQuery: tenantBaseQuery,

  tagTypes: ["Admins", "Visits"],

  serializeQueryArgs: ({ endpointName, queryArgs }) => {
    const orgSlug = getCurrentOrgSlug();

    return `${orgSlug}:${endpointName}:${JSON.stringify(queryArgs ?? null)}`;
  },

  endpoints: () => ({}),
});