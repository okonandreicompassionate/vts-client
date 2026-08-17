import { createApi } from "@reduxjs/toolkit/query/react";
import { publicBaseQuery } from "./public-base-query";

const getCurrentOrgSlug = () => {
  const [, orgSlug] = window.location.pathname.split("/");
  return orgSlug || "no-tenant";
};

export const publicApi = createApi({
  reducerPath: "publicApi",

  baseQuery: publicBaseQuery,

  tagTypes: ["Visits"],

  serializeQueryArgs: ({ endpointName, queryArgs }) => {
    const orgSlug = getCurrentOrgSlug();

    return `${orgSlug}:${endpointName}:${JSON.stringify(
      queryArgs ?? null,
    )}`;
  },

  endpoints: () => ({}),
});