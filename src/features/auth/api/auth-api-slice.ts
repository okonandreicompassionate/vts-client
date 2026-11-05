import { api } from "@/lib/api/api";

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

export const authApi = api.injectEndpoints({
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

export const publicAuthApi = api.injectEndpoints({
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

    // Always answers with the same message, whether or not the email has an account.
    forgotPassword: builder.mutation<{ message: string }, { email: string }>({
      query: (body) => ({ url: "/auth/forgot-password", method: "POST", body }),
    }),

    resetPassword: builder.mutation<{ message: string }, { token: string; password: string }>({
      query: (body) => ({ url: "/auth/reset-password", method: "POST", body }),
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
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = publicAuthApi;

