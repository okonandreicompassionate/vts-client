import { api } from "../../../lib/api/base";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    adminLogin: builder.mutation({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),

    microsoftLogin: builder.mutation({
      query: (body) => ({
        url: "/auth/microsoft",
        method: "POST",
        body,
      }),
    }),

    getProfile: builder.query({
      query: () => "/auth/profile",
    }),

     getVisits: builder.query({
      query: ({ page, limit }) => ({
        url: "/visits",
        params: { page, limit },
      }),
      providesTags: ["Visits"],
    }),

    approveVisit: builder.mutation({
      query: (id) => ({
        url: `/visits/${id}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: ["Visits"],
    }),
  }),
});

export const {
  useAdminLoginMutation,
  useMicrosoftLoginMutation,
  useGetProfileQuery,
  useGetVisitsQuery,
  useApproveVisitMutation,
} = authApi;