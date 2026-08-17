import { adminApi } from "../../../lib/api/admin/admin-api";
import type {
  UserProfile,
  SettingsResponse,
  UpdatePasswordPayload,
  UpdateSettingsPayload,
  UpdateProfilePayload,
} from "../types/api-types";

export const settingsApi = adminApi.injectEndpoints({
  endpoints: (builder) => ({

    getProfile: builder.query<UserProfile, void>({
      query: () => "/auth/profile",
      providesTags: [{ type: "Settings", id: "PROFILE" }],
      keepUnusedDataFor: 0,
    }),

    getSettings: builder.query<SettingsResponse, void>({
      query: () => "/auth/settings",
      providesTags: [{ type: "Settings", id: "SETTINGS" }],
    }),

    updateProfile: builder.mutation<UserProfile, UpdateProfilePayload>({
      query: (body) => ({
        url: "/auth/profile",
        method: "PATCH",
        body,
      }),
      invalidatesTags: [{ type: "Settings", id: "PROFILE" }],
    }),

    updatePassword: builder.mutation<{ success: boolean }, UpdatePasswordPayload>({
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
        { type: "Settings", id: "PROFILE" },
        { type: "Settings", id: "SETTINGS" },
      ],
    }),

   
  }),
});

export const {
  useGetProfileQuery,
  useGetSettingsQuery,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
  useUpdateSettingsMutation,
} = settingsApi;
