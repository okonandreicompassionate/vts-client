import { adminApi } from "@/lib/api/admin/admin-api";
import { publicApi } from "@/lib/api/public/public-api";

import type {
  JoinOrganizationWithPasswordPayload,
  JoinOrganizationWithPasswordResponse,
} from "@/features/users/types/api-types";

import type {
  LoginPayload,
  MicrosoftLoginPayload,
  LoginResponse,
  RefreshResponse,
} from "../types/api-types";

export const authApi = adminApi.injectEndpoints({
  endpoints: (builder) => ({
    Login: builder.mutation<LoginResponse, LoginPayload>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),

    microsoftLogin: builder.mutation<LoginResponse, MicrosoftLoginPayload>({
      query: (body) => ({
        url: "/auth/microsoft",
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
  useRefreshMutation,
} = authApi;

export const {
  useJoinOrganizationWithPasswordMutation,
} = publicAuthApi;