import type { VisitListResponse, VisitStats } from "../types/api-types";
import { adminApi } from "@/lib/api/admin/admin-api";

export const visitsApi = adminApi.injectEndpoints({
  endpoints: (builder) => ({
    approveVisit: builder.mutation<void, string>({
      query: (id) => ({
        url: `/visits/${id}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: ["Visits"],
    }),

    signoffVisit: builder.mutation<void, string>({
      query: (id) => ({
        url: `/visits/${id}/signoff`,
        method: "PATCH",
      }),
      invalidatesTags: ["Visits"],
    }),

    getVisitStats: builder.query<VisitStats, void>({
      query: () => "/visits/stats",
      providesTags: ["Visits"],
    }),

    rejectVisit: builder.mutation<void, { id: string; reason?: string }>({
      query: ({ id, reason }) => ({
        url: `/visits/${id}/reject`,
        method: "PATCH",
        body: { reason },
      }),
      invalidatesTags: ["Visits"],
    }),

    getVisits: builder.query<VisitListResponse, { page: number; limit: number; status?: string }>({
      query: ({ page, limit, status }) => ({
        url: "/visits",
        params: {
          page,
          limit,
          ...(status && { status }),
        },
      }),
      providesTags: ["Visits"],
    }),
  }),
});

export const {
  useApproveVisitMutation,
  useSignoffVisitMutation,
  useRejectVisitMutation,
  useGetVisitStatsQuery,
  useGetVisitsQuery,
} = visitsApi;
