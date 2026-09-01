import type { VisitListResponse, VisitStats, VisitResponse, BulkVisitIds } from "../types/api-types";
import { adminApi } from "@/lib/api/admin/admin-api";
import { csrfFetch } from "@/lib/api/csrf-fetch";

const VISITS_GRAPHQL_QUERY = `
  query Visits($orgId: String!, $page: Int!, $limit: Int!, $status: VisitStatus, $search: String) {
    visits(orgId: $orgId, page: $page, limit: $limit, status: $status, search: $search) {
      data {
        id
        referenceId
        name
        phoneNumber
        email
        hostName
        purpose
        checkInTime
        status
        registeredAt
      }
      meta {
        page
        limit
        total
        totalPages
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

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
        search?: string;
      }
    >({
      async queryFn(args) {
        const orgSlug = window.location.pathname.split("/")[1];

        const response = await csrfFetch(`${import.meta.env.VITE_API_URL ?? ""}/graphql`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: VISITS_GRAPHQL_QUERY,
            variables: {
              orgId: orgSlug,
              page: args.page,
              limit: args.limit,
              ...(args.status ? { status: args.status } : {}),
              ...(args.search ? { search: args.search } : {}),
            },
          }),
        });

        const json = (await response.json()) as {
          data?: { visits?: VisitListResponse };
          errors?: Array<{ message?: string }>;
        };

        if (!response.ok || json.errors?.length) {
          return {
            error: {
              status: response.status,
              data: json.errors ?? json,
            },
          };
        }

        return {
          data:
            json.data?.visits ?? {
              data: [],
              meta: {
                page: 1,
                limit: args.limit,
                total: 0,
                totalPages: 0,
                hasNextPage: false,
                hasPreviousPage: false,
              },
            },
        };
      },
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
