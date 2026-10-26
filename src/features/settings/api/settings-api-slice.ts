import { adminApi } from "../../../lib/api/admin/admin-api";
import type {
  ApiUserProfile,
  UserProfile,
  SettingsResponse,
  UpdatePasswordPayload,
  UpdateSettingsPayload,
  UpdateProfilePayload,
} from "../types/api-types";
import { normalizeUserRole } from "@/types/user-role";

function normalizeProfile(profile: ApiUserProfile): UserProfile {
  const role = profile.role ?? profile.userRole;
  if (!role) {
    throw new Error("Profile response is missing role information.");
  }

  const fullName =
    profile.fullName?.trim() ??
    `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim();
  const orgSlug = profile.orgSlug ?? profile.organization?.slug;

  if (!orgSlug) {
    throw new Error("Profile response is missing its organization slug.");
  }

  return {
    ...profile,
    fullName,
    phoneNumber: profile.phoneNumber ?? profile.phone ?? "",
    orgSlug,
    role: normalizeUserRole(role),
  };
}

export const settingsApi = adminApi.injectEndpoints({
  endpoints: (builder) => ({

    getProfile: builder.query<UserProfile, void>({
      query: () => "/auth/profile",
      transformResponse: normalizeProfile,
      providesTags: [{ type: "Settings", id: "PROFILE" }],
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
