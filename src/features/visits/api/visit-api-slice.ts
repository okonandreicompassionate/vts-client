
import { visitorApi } from "@/features/visits/api/visit-base";

import type {
  CreateVisitPayload,
  CreateVisitResponse,
  VerifyIdentityPayload,
  VerifyIdentityResponse,
  VisitListResponse,
  VisitResponse,
  VisitStats,
} from "../types/api-types";

export const visitsApi = visitorApi.injectEndpoints({
  endpoints: (builder) => ({
    createVisit: builder.mutation<CreateVisitResponse, CreateVisitPayload>({
      query: (body) => ({
        url: "/visits",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Visits"],
    }),

    checkInVisit: builder.mutation<void, string>({
      query: (id) => ({
        url: `/visits/${id}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        "Visits",
        { type: "Visits", id },
      ],
    }),

    getVisit: builder.query<VisitResponse, string>({
      query: (id) => `/visits/${id}`,
      providesTags: (_result, _error, id) => [
        { type: "Visits", id },
      ],
    }),

    verifyVisitIdentity: builder.mutation<
      VerifyIdentityResponse,
      VerifyIdentityPayload
    >({
      query: (body) => ({
        url: "/visits/verify-identity",
        method: "POST",
        body,
      }),
    }),

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
  useCreateVisitMutation,
  useCheckInVisitMutation,
  useGetVisitQuery,
  useVerifyVisitIdentityMutation,
  useApproveVisitMutation,
  useSignoffVisitMutation,
  useRejectVisitMutation,
  useGetVisitStatsQuery,
  useGetVisitsQuery,
} = visitsApi;

