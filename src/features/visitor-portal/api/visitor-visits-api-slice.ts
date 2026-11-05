import { api } from "@/lib/api/api";
import type { VisitorVisit, VisitorAppointmentsResponse } from "../types/visitor-appointments";

export const visitorVisitsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getVisitorAppointments: builder.query<
      VisitorAppointmentsResponse,
      { page: number; orgSlug: string; sessionKey: string }
    >({
      query: ({ page }) => ({ url: "/visitor/visits", params: { page, limit: 10 } }),
      providesTags: ["Visits"],
    }),
    getVisitorVisit: builder.query<VisitorVisit, { id: string; sessionKey: string }>({
      query: ({ id }) => `/visitor/visits/${id}`,
      providesTags: (_result, _error, { id }) => [{ type: "Visits", id }],
    }),
  }),
});

export const { useGetVisitorVisitQuery, useGetVisitorAppointmentsQuery } = visitorVisitsApi;
