import type { VisitorMeResponse, VisitResponse } from "../types/api-types";

import { visitorApi } from "@/lib/api/visitor/visitor-api";

export const visitorVisitsApi = visitorApi.injectEndpoints({
  endpoints: (builder) => ({
    getVisit: builder.query<VisitResponse, string>({
      query: (id) => `/visits/visitor/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Visits", id }],
    }),

    getVisitorMe: builder.query<VisitorMeResponse, void>({
      query: () => ({
        url: "/auth/visitor/me",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetVisitQuery, useGetVisitorMeQuery } = visitorVisitsApi;
