import type { VisitListResponse, VisitStats, VisitResponse, BulkVisitIds } from "../types/api-types";
import { adminApi } from "@/lib/api/admin/admin-api";


export const adminVisitsApi = adminApi.injectEndpoints({
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

    rejectVisit: builder.mutation<void, { id: string; reason?: string }>({
      query: ({ id, reason }) => ({
        url: `/visits/${id}/reject`,
        method: "PATCH",
        body: { reason },
      }),
      invalidatesTags: ["Visits"],
    }),

    approveManyVisits: builder.mutation<void, BulkVisitIds>({
      query: (body) => ({
        url: "/visits/bulk/approve",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Visits"],
    }),

    rejectManyVisits: builder.mutation<void, BulkVisitIds>({
      query: (body) => ({
        url: "/visits/bulk/reject",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Visits"],
    }),

    signoffManyVisits: builder.mutation<void, BulkVisitIds>({
      query: (body) => ({
        url: "/visits/bulk/signoff",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Visits"],
    }),

    getVisitStats: builder.query<VisitStats, void>({
      query: () => "/visits/stats",
      providesTags: ["Visits"],
    }),

    getVisits: builder.query<
      VisitListResponse,
      {
        page: number;
        limit: number;
        status?: string;
      }
    >({
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

    getVisit: builder.query<VisitResponse, string>({
      query: (id) => `/visits/admin/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Visits", id }],
    }),
  }),
});

export const {
  useApproveVisitMutation,
  useSignoffVisitMutation,
  useRejectVisitMutation,

  useApproveManyVisitsMutation,
  useRejectManyVisitsMutation,
  useSignoffManyVisitsMutation,

  useGetVisitStatsQuery,
  useGetVisitsQuery,
  useGetVisitQuery,
} = adminVisitsApi;
