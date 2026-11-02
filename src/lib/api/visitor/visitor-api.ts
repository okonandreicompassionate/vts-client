import { createApi } from "@reduxjs/toolkit/query/react";

import { visitorBaseQuery } from "./visitor-base-query";

export const visitorApi = createApi({
  reducerPath: "visitorApi",

  baseQuery: visitorBaseQuery,

  tagTypes: ["Visits"],

  endpoints: () => ({}),
});
