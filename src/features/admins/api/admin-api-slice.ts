import { api } from "../../../lib/api/base";

import type {
  VisitListResponse,
  UserProfile,
  SettingsResponse,
  VisitRecord,
  VisitStats,
  UpdatePasswordPayload,
  UpdateSettingsPayload,
  UpdateProfilePayload,
  AdminLoginPayload,
  MicrosoftLoginPayload,
  LoginResponse,
} from "../types/api-types";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    adminLogin: builder.mutation<LoginResponse, AdminLoginPayload>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),

    microsoftLogin: builder.mutation<LoginResponse, MicrosoftLoginPayload>({
      query: (body) => ({
        url: "/auth/microsoft",
        method: "POST",
        body,
      }),
    }),

    getProfile: builder.query<UserProfile, void>({
      query: () => "/auth/profile",
      providesTags: [{ type: "Admins", id: "PROFILE" }],
      keepUnusedDataFor: 0,
    }),

    getSettings: builder.query<SettingsResponse, void>({
      query: () => "/auth/settings",
      providesTags: [{ type: "Admins", id: "SETTINGS" }],
    }),

    updateProfile: builder.mutation<UserProfile, UpdateProfilePayload>({
      query: (body) => ({
        url: "/auth/profile",
        method: "PATCH",
        body,
      }),
      invalidatesTags: [{ type: "Admins", id: "PROFILE" }],
    }),

    updatePassword: builder.mutation<
      { success: boolean },
      UpdatePasswordPayload
    >({
      query: (body) => ({
        url: "/auth/password",
        method: "PATCH",
        body,
      }),
    }),

    updateSettings: builder.mutation<unknown, UpdateSettingsPayload>({
      query: (body) => ({
        url: "/auth/settings",
        method: "PATCH",
        body,
      }),
      invalidatesTags: [
        { type: "Admins", id: "PROFILE" },
        { type: "Admins", id: "SETTINGS" },
      ],
    }),

    getVisits: builder.query<
      VisitListResponse,
      { page: number; limit: number; status?: string }
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

    getVisit: builder.query<VisitRecord, string>({
      query: (id) => ({
        url: `/visits/${id}`,
      }),
      providesTags: (_result, _error, id) => [
        { type: "Visits", id },
      ],
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
  useGetSettingsQuery,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
  useUpdateSettingsMutation,
  useGetVisitsQuery,
  useApproveVisitMutation,
  useSignoffVisitMutation,
  useRejectVisitMutation,
  useGetVisitQuery,
  useGetVisitStatsQuery,
} = authApi;