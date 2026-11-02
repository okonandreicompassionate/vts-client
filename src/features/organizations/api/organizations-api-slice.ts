import { publicApi } from "@/lib/api/public/public-api";
import { publicOrganizationApiPath } from "../utils/organization-path";
import type { PublicOrganization } from "../types/organization";

export const organizationsApi = publicApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicOrganization: builder.query<PublicOrganization, string>({
      query: (orgSlug) => publicOrganizationApiPath(orgSlug),
      providesTags: (_result, _error, orgSlug) => [{ type: "Organization", id: orgSlug }],
    }),
  }),
});

export const { useGetPublicOrganizationQuery } = organizationsApi;
