import { api } from "@/lib/api/api";
import type { ApiUserProfile, UserProfile } from "@/types/user-profile";
import { normalizeUserRole } from "@/types/user-role";

export function normalizeProfile(profile: ApiUserProfile): UserProfile {
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

/**
 * The signed-in staff member. Shared by auth (session checks), settings and
 * admins, so it lives outside any one feature.
 */
export const profileApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<UserProfile, void>({
      query: () => "/auth/profile",
      transformResponse: normalizeProfile,
      providesTags: [{ type: "Settings", id: "PROFILE" }],
    }),
  }),
});

export const { useGetProfileQuery } = profileApi;
