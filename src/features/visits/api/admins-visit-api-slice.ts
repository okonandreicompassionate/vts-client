import { api } from "@/lib/api/api";
import type {
  VisitStats,
  ApiVisitStats,
  BulkVisitIds,
  BookAppointmentPayload,
  VisitListPage,
  VisitListParams,
  DashboardData,
  DashboardParams,
} from "../types/api-types";
import type { CreateVisitResponse, HostItem, VisitResponse } from "@/types/visit-api";
import { toHostOptions } from "@/utils/host-options";
import { isSameHostName } from "../utils/visits";

export const adminVisitsApi = api.injectEndpoints({
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

    getAppointmentsForHost: builder.query<VisitListPage, string>({
      async queryFn(hostName, _queryApi, _extraOptions, baseQuery) {
        const visits: VisitListPage["data"] = [];
        let page = 1;
        let hasNextPage = true;

        while (hasNextPage) {
          const result = await baseQuery({
            url: "/visits",
            params: { page, limit: 100 },
          });

          if (result.error) {
            return { error: result.error };
          }

          const visitPage = result.data as VisitListPage;
          visits.push(
            ...visitPage.data.filter((visit) => isSameHostName(visit.hostName, hostName)),
          );
          hasNextPage = visitPage.meta.hasNextPage;
          page = visitPage.meta.page + 1;
        }

        return {
          data: {
            data: visits,
            meta: {
              page: 1,
              limit: visits.length,
              total: visits.length,
              totalPages: 1,
              hasNextPage: false,
              hasPreviousPage: false,
            },
          },
        };
      },
      providesTags: ["Visits"],
    }),

    // Today's numbers and lists for the caller's role, plus 30-day trends for admins.
    getDashboard: builder.query<DashboardData, DashboardParams>({
      query: (params) => ({ url: "/visits/dashboard", params }),
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

    // The visit's host answers; a reviewer still makes the final call.
    hostDecideVisit: builder.mutation<
      void,
      { id: string; decision: "APPROVED" | "REJECTED"; note?: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/visits/${id}/host-decision`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Visits", "Notifications"],
    }),

    rejectVisit: builder.mutation<void, { id: string; reason?: string }>({
      query: ({ id, reason }) => ({
        url: `/visits/${id}/reject`,
        method: "PATCH",
        body: { reason },
      }),
      invalidatesTags: ["Visits"],
    }),

    // Replaces the visit with a new one at the new time (the old one is kept as history).
    rescheduleVisit: builder.mutation<unknown, { id: string; date: string; time: string }>({
      query: ({ id, ...body }) => ({
        url: `/visits/${id}/reschedule`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Visits"],
    }),

    // Before the visitor arrives; the host or an admin.
    cancelVisit: builder.mutation<unknown, { id: string; reason?: string }>({
      query: ({ id, reason }) => ({
        url: `/visits/${id}/cancel`,
        method: "PATCH",
        body: reason ? { reason } : {},
      }),
      invalidatesTags: ["Visits"],
    }),

    // Before the visitor arrives; the host or an admin. Only admins may change the host.
    updateVisit: builder.mutation<
      { id: string },
      {
        id: string;
        firstName?: string;
        lastName?: string;
        phone?: string;
        purpose?: string;
        hostId?: string;
      }
    >({
      query: ({ id, ...body }) => ({
        url: `/visits/${id}`,
        method: "PATCH",
        body,
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
        url: "/visits/bulk/checkout",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Visits"],
    }),

    getVisitStats: builder.query<VisitStats, void>({
      query: () => "/visits/stats",
      transformResponse: ({ checkedIn, checkedOut, ...counts }: ApiVisitStats): VisitStats => ({
        ...counts,
        signedIn: checkedIn,
        signedOff: checkedOut,
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
  useGetVisitsQuery,
  useGetAppointmentsForHostQuery,
  useGetDashboardQuery,
  useRescheduleVisitMutation,
  useCancelVisitMutation,
  useUpdateVisitMutation,
  useGetStaffHostsQuery,
  useBookAppointmentMutation,
  useApproveVisitMutation,
  useCheckInVisitMutation,
  useCheckOutVisitMutation,
  useRejectVisitMutation,
  useHostDecideVisitMutation,

  useApproveManyVisitsMutation,
  useRejectManyVisitsMutation,
  useSignoffManyVisitsMutation,

  useGetVisitStatsQuery,
  useGetVisitQuery,
} = adminVisitsApi;
