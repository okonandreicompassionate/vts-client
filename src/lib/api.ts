import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface HealthResponse {
  status: string;
}

export const ORG_SLUG = "zoracom";

export interface VerifyIdentityPayload {
  orgSlug: string;
  email: string;
  phoneNumber: string;
}

export interface CreateVisitPayload {
  orgSlug: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  hostName: string;
  department: string;
  purposeOfVisit: string;
}

export interface VisitRecord {
  id?: string;
  fullName?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  phone?: string;
  hostName?: string;
  host?: string;
  department?: string;
  purposeOfVisit?: string;
  purpose?: string;
  status?: string;
  time?: string;
  checkIn?: string;
  checkInTime?: string;
  createdAt?: string;
}

export interface VisitListResponse {
  data?: VisitRecord[];
  visits?: VisitRecord[];
}

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || "/api",
    prepareHeaders: (headers) => {
      if (typeof window !== "undefined") {
        const token = window.localStorage.getItem("token");
        if (token) {
          headers.set("authorization", `Bearer ${token}`);
        }
      }

      return headers;
    },
  }),
  tagTypes: ["Admins", "Visits"],
  endpoints: (builder) => ({
    getHealth: builder.query<HealthResponse, void>({
      query: () => "health",
      providesTags: ["Admins"],
    }),
    verifyVisitIdentity: builder.mutation<
      { success?: boolean; message?: string },
      VerifyIdentityPayload
    >({
      query: (body) => ({
        url: "visits/verify-identity",
        method: "POST",
        body,
      }),
    }),
    createVisit: builder.mutation<{ success?: boolean; message?: string }, CreateVisitPayload>({
      query: (body) => ({
        url: "visits",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Visits"],
    }),
    getVisits: builder.query<VisitRecord[], void>({
      query: () => "visits",
      transformResponse: (response: VisitListResponse | VisitRecord[] | undefined) => {
        if (Array.isArray(response)) {
          return response;
        }

        if (response?.data) {
          return response.data;
        }

        if (response?.visits) {
          return response.visits;
        }

        return [];
      },
      providesTags: ["Visits"],
    }),
  }),
});

export const {
  useGetHealthQuery,
  useVerifyVisitIdentityMutation,
  useCreateVisitMutation,
  useGetVisitsQuery,
} = api;
