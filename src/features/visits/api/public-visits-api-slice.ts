import type {
  VerifyIdentityPayload,
  VerifyIdentityResponse,
  CreateVisitPayload,
  CreateVisitResponse,
} from "../types/api-types";
import { publicApi } from "@/lib/api/public/public-api";

export const publicVisitsApi = publicApi.injectEndpoints({
  endpoints: (builder) => ({
    verifyVisitIdentity: builder.mutation<VerifyIdentityResponse, VerifyIdentityPayload>({
      query: (body) => ({
        url: "/visits/verify-identity",
        method: "POST",
        body,
      }),
    }),

    createVisit: builder.mutation<CreateVisitResponse, CreateVisitPayload>({
      query: (body) => ({
        url: "/visits",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Visits"],
    }),
  }),
});

export const { useVerifyVisitIdentityMutation, useCreateVisitMutation } = publicVisitsApi;
