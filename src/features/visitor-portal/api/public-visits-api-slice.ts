import { api } from "@/lib/api/api";
import type {
  RequestVisitorCodePayload,
  VerifyVisitorCodePayload,
  VerifyIdentityResponse,
  CreateVisitPayload,
  PublicCreateVisitResponse,
} from "../types/api-types";
import type { HostItem } from "@/types/visit-api";
import { publicOrganizationApiPath } from "@/utils/organization-path";
import { toHostOptions } from "@/utils/host-options";
import type { VisitorEntry } from "../types/visitor-entry";

type WithOrgSlug<T> = T & { orgSlug: string };

export const publicVisitsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    lookupVisitorEntry: builder.mutation<VisitorEntry, { orgSlug: string; email: string }>({
      query: ({ orgSlug, email }) => ({
        url: publicOrganizationApiPath(orgSlug, "/visits/lookup"),
        method: "POST",
        body: { email },
      }),
      invalidatesTags: ["Organization"],
    }),
    getVisitorEntry: builder.query<VisitorEntry, { orgSlug: string; email: string }>({
      query: ({ orgSlug }) => publicOrganizationApiPath(orgSlug, "/visits/entry"),
      providesTags: ["Organization"],
    }),
    getVisitorVerificationStatus: builder.query<
      {
        email: string | null;
        entryEmail: string | null;
        verified: boolean;
        requireVisitorEmailVerification: boolean;
      },
      string
    >({
      query: (orgSlug) => publicOrganizationApiPath(orgSlug, "/visitor-auth/status"),
      providesTags: ["Organization"],
    }),

    /** Requires verification when enabled by the organization. */
    getHosts: builder.query<HostItem[], string>({
      query: (orgSlug) => publicOrganizationApiPath(orgSlug, "/visits/hosts"),
      transformResponse: toHostOptions,
    }),

    requestVisitorCode: builder.mutation<
      { message: string; retryAfterSeconds: number },
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
      invalidatesTags: ["Organization"],
    }),

    createVisit: builder.mutation<PublicCreateVisitResponse, WithOrgSlug<CreateVisitPayload>>({
      query: ({ orgSlug, ...body }) => ({
        url: publicOrganizationApiPath(orgSlug, "/visits"),
        method: "POST",
        body,
      }),
      invalidatesTags: ["Visits", "Organization"],
    }),
  }),
});

export const {
  useLookupVisitorEntryMutation,
  useGetVisitorEntryQuery,
  useGetVisitorVerificationStatusQuery,
  useGetHostsQuery,
  useRequestVisitorCodeMutation,
  useVerifyVisitorCodeMutation,
  useCreateVisitMutation,
} = publicVisitsApi;
