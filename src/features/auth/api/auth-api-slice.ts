import { adminApi } from "@/lib/api/admin/admin-api";

import type { LoginPayload, MicrosoftLoginPayload, LoginResponse } from "../types/api-types";

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
  }),
});

export const { useLoginMutation, useMicrosoftLoginMutation } = authApi;
