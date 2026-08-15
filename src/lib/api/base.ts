import { createApi } from "@reduxjs/toolkit/query/react";
import { authBaseQuery } from "../../features/auth/api/auth-base-query";
const getCurrentOrgSlug = () => {
  const [, orgSlug] = window.location.pathname.split("/");

  return orgSlug || "no-tenant";
};

export const api = createApi({
  reducerPath: "api",

  baseQuery: authBaseQuery,

  tagTypes: ["Settings", "Visits", "Employees", "Notifications", "Users"],

  serializeQueryArgs: ({ endpointName, queryArgs }) => {
    const orgSlug = getCurrentOrgSlug();

    return `${orgSlug}:${endpointName}:${JSON.stringify(queryArgs ?? null)}`;
  },

  endpoints: () => ({}),
});