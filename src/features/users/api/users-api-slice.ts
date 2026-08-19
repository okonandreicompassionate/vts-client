import { adminApi } from "@/lib/api/admin/admin-api";

import type {
  AdminRole,
  AdminUserItem,
  GetAdminByIdResponse,
  GetAdminsResponse,
  InviteAdminPayload,
  InviteAdminResponse,
} from "../types/api-types";

export const usersApi = adminApi.injectEndpoints({
  endpoints: (builder) => ({
    createInvite: builder.mutation<InviteAdminResponse, InviteAdminPayload>({
      query: ({ email, role }) => ({
        url: "/invites",
        method: "POST",
        body: {
          email: email.trim().toLowerCase(),
          role,
        },
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),

    getAdmins: builder.query<GetAdminsResponse, void>({
      query: () => "/auth/admins",
      providesTags: [{ type: "Users", id: "LIST" }],
    }),

    getAdminById: builder.query<GetAdminByIdResponse, string>({
      query: (id) => `/auth/admin/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Users", id }],
    }),

    deleteAdmin: builder.mutation<void, { orgSlug: string; adminId: string }>({
      query: ({ orgSlug, adminId }) => ({
        url: `/${orgSlug}/users/admins/${adminId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useCreateInviteMutation, useGetAdminsQuery, useGetAdminByIdQuery, useDeleteAdminMutation } = usersApi;

export type {
  AdminRole,
  AdminUserItem,
  GetAdminByIdResponse,
  GetAdminsResponse,
  InviteAdminPayload,
  InviteAdminResponse,
};
