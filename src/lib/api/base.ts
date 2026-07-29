import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  AdminLoginPayload,
  AuthResponse,
  CreateVisitPayload,
  HealthResponse,
  MicrosoftLoginPayload,
  UserProfile,
  VerifyIdentityPayload,
  VisitListParams,
  VisitListResponse,
  VisitListResult,
  VisitRecord,
} from "./types";


export const getAuthToken = (response: AuthResponse) =>
  response.token ??
  response.accessToken ??
  response.data?.token ??
  response.data?.accessToken ??
  "";

const getVisitsFromResponse = (response: VisitListResponse | VisitRecord[] | undefined) => {
  if (Array.isArray(response)) {
    return response;
  }

  return response?.data ?? response?.visits ?? [];
};

const getTotalFromResponse = (
  response: VisitListResponse | VisitRecord[] | undefined,
  fallback: number,
) => {
  if (Array.isArray(response)) {
    return response.length;
  }

  return (
    response?.total ??
    response?.totalItems ??
    response?.count ??
    response?.meta?.total ??
    response?.meta?.totalItems ??
    response?.meta?.count ??
    response?.pagination?.total ??
    response?.pagination?.totalItems ??
    response?.pagination?.count ??
    fallback
  );
};

const fallbackBaseUrl = "http://localhost:3000";
const configuredBaseUrl = (import.meta.env.VITE_API_URL ?? fallbackBaseUrl).replace(/\/$/, "");
export const baseUrl = import.meta.env.VITE_API_URL ? "" : configuredBaseUrl;

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: "include",
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
    adminLogin: builder.mutation<AuthResponse, AdminLoginPayload>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),
    microsoftLogin: builder.mutation<AuthResponse, MicrosoftLoginPayload>({
      query: (body) => ({
        url: "/auth/microsoft",
        method: "POST",
        body,
      }),
    }),
    getProfile: builder.query<UserProfile, void>({
      query: () => "/auth/profile",
      transformResponse: (
        response: UserProfile | { data?: UserProfile; user?: UserProfile },
      ): UserProfile => {
        if ("data" in response && response.data) return response.data;
        if ("user" in response && response.user) return response.user;
        return response as UserProfile;
      },
      providesTags: ["Admins"],
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
    createVisit: builder.mutation<{ success?: boolean; message?: string }, CreateVisitPayload>({
      query: (body) => ({
        url: "/visits",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Visits"],
    }),
    getVisits: builder.query<VisitListResult, VisitListParams>({
      query: ({ page, limit, status, search }) => ({
        url: "/visits",
        params: {
          page,
          limit,
          ...(status ? { status } : {}),
          ...(search ? { search } : {}),
        },
      }),
      transformResponse: (
        response: VisitListResponse | VisitRecord[] | undefined,
        _meta,
        params,
      ) => {
        const records = getVisitsFromResponse(response);

        return {
          records,
          total: getTotalFromResponse(response, records.length),
          page:
            !Array.isArray(response) && response?.page
              ? response.page
              : !Array.isArray(response) && response?.meta?.page
                ? response.meta.page
                : !Array.isArray(response) && response?.pagination?.page
                  ? response.pagination.page
                  : params.page,
          limit:
            !Array.isArray(response) && response?.limit
              ? response.limit
              : !Array.isArray(response) && response?.meta?.limit
                ? response.meta.limit
                : !Array.isArray(response) && response?.pagination?.limit
                  ? response.pagination.limit
                  : params.limit,
        };
      },
      providesTags: ["Visits"],
    }),
    approveVisit: builder.mutation<VisitRecord | { success?: boolean; message?: string }, string>({
      query: (id) => ({
        url: `/visits/${id}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: ["Visits"],
    }),
  }),
});

export const {
  useGetHealthQuery,
  useAdminLoginMutation,
  useMicrosoftLoginMutation,
  useGetProfileQuery,
  useVerifyVisitIdentityMutation,
  useCreateVisitMutation,
  useGetVisitsQuery,
  useApproveVisitMutation,
} = baseApi;
