import { adminApi } from "@/lib/api/admin/admin-api";
import { publicApi } from "@/lib/api/public/public-api";

import type {
  JoinOrganizationWithPasswordPayload,
  JoinOrganizationWithPasswordResponse,
} from "../types/api-types";

import type {
  LoginPayload,
  MicrosoftLoginPayload,
  LoginResponse,
  RefreshResponse,
  SelectOrganizationPayload,
  SignInResponse,
} from "../types/api-types";

export const authApi = adminApi.injectEndpoints({
  endpoints: (builder) => ({
    Login: builder.mutation<SignInResponse, LoginPayload>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),

    microsoftLogin: builder.mutation<SignInResponse, MicrosoftLoginPayload>({
      query: (body) => ({
        url: "/auth/microsoft",
        method: "POST",
        body,
      }),
    }),

    selectOrganization: builder.mutation<LoginResponse, SelectOrganizationPayload>({
      query: (body) => ({
        url: "/auth/select-organization",
        method: "POST",
        body,
      }),
    }),

    refresh: builder.mutation<RefreshResponse, void>({
      query: () => ({
        url: "/auth/refresh",
        method: "POST",
      }),
    }),
  }),
});

export const publicAuthApi = publicApi.injectEndpoints({
  endpoints: (builder) => ({
    joinOrganizationWithPassword: builder.mutation<
      JoinOrganizationWithPasswordResponse,
      JoinOrganizationWithPasswordPayload
    >({
      query: (body) => ({
        url: "/auth/join/password",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useMicrosoftLoginMutation,
  useSelectOrganizationMutation,
  useRefreshMutation,
} = authApi;

export const {
  useJoinOrganizationWithPasswordMutation,
} = publicAuthApi;

