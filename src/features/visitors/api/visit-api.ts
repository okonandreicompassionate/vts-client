import { api } from "../../../lib/api/base";
import type { VerifyIdentityPayload } from "../../../lib/api/types";

export const visitsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    

    createVisit: builder.mutation({
      query: (body) => ({
        url: "/visits",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Visits"],
    }),

    verifyVisitIdentity: builder.mutation<
      { success?: boolean; message?: string },
      VerifyIdentityPayload
    >({
      query: (body) => ({
        url: "/visits/verify-identity",
        method: "POST",
        body,
      }),
    }),

  }),
});

export const {
  useCreateVisitMutation,
  useVerifyVisitIdentityMutation,
} = visitsApi;