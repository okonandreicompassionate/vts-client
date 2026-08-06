import { api } from "../../../lib/api/base";
import type { VisitListResponse, UserProfile, VisitRecord, VisitStats } from "../types/api-types";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    adminLogin: builder.mutation({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),

    microsoftLogin: builder.mutation({
      query: (body) => ({
        url: "/auth/microsoft",
        method: "POST",
        body,
      }),
    }),

    getProfile: builder.query<UserProfile, void>({
      query: () => "/auth/profile",
    }),

    getVisits: builder.query<VisitListResponse, { page: number; limit: number; status?: string }>({
      query: ({ page, limit, status }) => ({
        url: "/visits",
        params: { page, limit, ...(status && { status }) },
      }),
      providesTags: ["Visits"],
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
      query: () => `/visits/stats`,
      providesTags: ["Visits"],
    }),

    getVisit: builder.query<VisitRecord, string>({
      query: (id) => ({
        url: `/visits/${id}`,
      }),
      providesTags: (_result, _error, id) => [{ type: "Visits", id }],
    }),

    rejectVisit: builder.mutation<void, { id: string; reason?: string }>({
      query: ({ id, reason }) => ({
        url: `/visits/${id}/reject`,
        method: "PATCH",
        body: { reason },
      }),
      invalidatesTags: ["Visits"],
    }),
  }),
});

export const {
  useAdminLoginMutation,
  useMicrosoftLoginMutation,
  useGetProfileQuery,
  useGetVisitsQuery,
  useApproveVisitMutation,
  useSignoffVisitMutation,
  useRejectVisitMutation,
  useGetVisitQuery,
  useGetVisitStatsQuery,
} = authApi;
