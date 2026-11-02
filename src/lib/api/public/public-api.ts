import { createApi } from "@reduxjs/toolkit/query/react";
import { publicBaseQuery } from "./public-base-query";

export const publicApi = createApi({
  reducerPath: "publicApi",

  baseQuery: publicBaseQuery,

  tagTypes: ["Visits", "Organization"],

  endpoints: () => ({}),
});
