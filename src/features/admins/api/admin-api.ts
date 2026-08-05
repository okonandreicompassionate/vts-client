import { api } from "../../../lib/api/base";
import type { VisitListResponse, UserProfile } from "../types/api-types";

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

    rejectVisit: builder.mutation<void, string>({
      query: (id) => ({
        url: `/visits/${id}/reject`,
        method: "PATCH",
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
} = authApi;
