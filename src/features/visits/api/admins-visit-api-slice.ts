import type {
  VisitStats,
  VisitResponse,
  BulkVisitIds,
  CreateVisitPayload,
  CreateVisitResponse,
} from "../types/api-types";
import { adminApi } from "@/lib/api/admin/admin-api";

export const adminVisitsApi = adminApi.injectEndpoints({
  endpoints: (builder) => ({
    bookAppointment: builder.mutation<CreateVisitResponse, CreateVisitPayload>({
      query: (body) => ({
        url: "/visits/book",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Visits"],
    }),

    approveVisit: builder.mutation<void, string>({
      query: (id) => ({
        url: `/visits/${id}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: ["Visits"],
    }),

    checkInVisit: builder.mutation<void, string>({
      query: (id) => ({
        url: `/visits/${id}/checkin`,
        method: "PATCH",
      }),
      invalidatesTags: ["Visits"],
    }),

    checkOutVisit: builder.mutation<void, string>({
      query: (id) => ({
        url: `/visits/${id}/checkout`,
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

    getVisit: builder.query<VisitResponse, string>({
      query: (id) => `/visits/admin/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Visits", id }],
    }),
  }),
});

export const {
  useBookAppointmentMutation,
  useApproveVisitMutation,
  useCheckInVisitMutation,
  useCheckOutVisitMutation,
  useRejectVisitMutation,

  useApproveManyVisitsMutation,
  useRejectManyVisitsMutation,
  useSignoffManyVisitsMutation,

  useGetVisitStatsQuery,
  useGetVisitQuery,
} = adminVisitsApi;
