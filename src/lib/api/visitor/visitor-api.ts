import { createApi } from "@reduxjs/toolkit/query/react";

import { visitorBaseQuery } from "./visitor-base-query";

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