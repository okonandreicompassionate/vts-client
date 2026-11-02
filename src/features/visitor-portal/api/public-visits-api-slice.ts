import type {
  RequestVisitorCodePayload,
  VerifyVisitorCodePayload,
  VerifyIdentityResponse,
  CreateVisitPayload,
} from "../types/api-types";
import type { CreateVisitResponse, HostItem } from "@/types/visit-api";
import { publicApi } from "@/lib/api/public/public-api";
import { publicOrganizationApiPath } from "@/utils/organization-path";
import { toHostOptions } from "@/utils/host-options";

type WithOrgSlug<T> = T & { orgSlug: string };

export const publicVisitsApi = publicApi.injectEndpoints({
  endpoints: (builder) => ({
    /** Only answers once the visitor has verified their email. */
    getHosts: builder.query<HostItem[], string>({
      query: (orgSlug) => publicOrganizationApiPath(orgSlug, "/visits/hosts"),
      transformResponse: toHostOptions,
    }),

    requestVisitorCode: builder.mutation<
      { message: string },
      WithOrgSlug<RequestVisitorCodePayload>
    >({
      query: ({ orgSlug, ...body }) => ({
        url: publicOrganizationApiPath(orgSlug, "/visitor-auth/request-code"),
        method: "POST",
        body,
      }),
    }),

    verifyVisitorCode: builder.mutation<
      VerifyIdentityResponse,
      WithOrgSlug<VerifyVisitorCodePayload>
    >({
      query: ({ orgSlug, ...body }) => ({
        url: publicOrganizationApiPath(orgSlug, "/visitor-auth/verify-code"),
        method: "POST",
        body,
      }),
    }),

    createVisit: builder.mutation<CreateVisitResponse, WithOrgSlug<CreateVisitPayload>>({
      query: ({ orgSlug, ...body }) => ({
        url: publicOrganizationApiPath(orgSlug, "/visits"),
        method: "POST",
        body,
      }),
      invalidatesTags: ["Visits"],
    }),
  }),
});

export const {
  useGetHostsQuery,
  useRequestVisitorCodeMutation,
  useVerifyVisitorCodeMutation,
  useCreateVisitMutation,
} = publicVisitsApi;
