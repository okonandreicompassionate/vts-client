import type {
  VisitStats,
  BulkVisitIds,
  BookAppointmentPayload,
  VisitListPage,
  VisitListParams,
} from "../types/api-types";
import type { CreateVisitResponse, HostItem, VisitResponse } from "@/types/visit-api";
import { adminApi } from "@/lib/api/admin/admin-api";
import { toHostOptions } from "@/utils/host-options";

export const adminVisitsApi = adminApi.injectEndpoints({
  endpoints: (builder) => ({
    // Role-scoped visit list - the server decides what each role may see.
    getVisits: builder.query<VisitListPage, VisitListParams>({
      query: ({ page, limit, status, search }) => ({
        url: "/visits",
        params: {
          page,
          limit,
          ...(status ? { status } : {}),
          ...(search ? { search } : {}),
        },
      }),
      providesTags: ["Visits"],
    }),

    // Staff directory for the booking form.
    getStaffHosts: builder.query<HostItem[], void>({
      query: () => "/users/hosts",
      transformResponse: toHostOptions,
    }),

    bookAppointment: builder.mutation<CreateVisitResponse, BookAppointmentPayload>({
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
  useGetVisitsQuery,
  useGetStaffHostsQuery,
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
