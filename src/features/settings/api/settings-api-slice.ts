import { adminApi } from "../../../lib/api/admin/admin-api";
import type {
  SettingsResponse,
  UpdatePasswordPayload,
  UpdateSettingsPayload,
  UpdateProfilePayload,
} from "../types/api-types";
import type { UserProfile } from "@/types/user-profile";
import { normalizeProfile } from "@/lib/auth/profile-api";

// Reading the signed-in profile lives in lib/auth (profile-api) - it is
// shared by auth, settings and admins.
export const settingsApi = adminApi.injectEndpoints({
  endpoints: (builder) => ({

    getSettings: builder.query<SettingsResponse, void>({
      query: () => "/organization/settings",
      providesTags: [{ type: "Settings", id: "SETTINGS" }],
    }),

    updateProfile: builder.mutation<UserProfile, UpdateProfilePayload>({
      query: (body) => ({
        url: "/auth/profile",
        method: "PATCH",
        body,
      }),
      transformResponse: normalizeProfile,
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
        url: "/organization/settings",
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
  useGetSettingsQuery,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
  useUpdateSettingsMutation,
} = settingsApi;
