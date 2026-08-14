import { api } from "../../../lib/api/base";
import type {
  UserProfile,
  SettingsResponse,
  UpdatePasswordPayload,
  UpdateSettingsPayload,
  UpdateProfilePayload,
} from "../types/api-types";

export const adminApi = api.injectEndpoints({
  endpoints: (builder) => ({

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
        { type: "Admins", id: "PROFILE" },
        { type: "Admins", id: "SETTINGS" },
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
} = adminApi;
