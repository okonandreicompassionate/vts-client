import { adminApi } from "@/lib/api/admin/admin-api";

import type {
  AdminRole,
  AdminUserItem,
  BulkDeleteAdminsPayload,
  BulkDeleteAdminsResponse,
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
      query: ({ adminId }) => ({
        url: `/users/admins/${adminId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),

    bulkDeleteAdmins: builder.mutation<BulkDeleteAdminsResponse, BulkDeleteAdminsPayload>({
      query: ({ ids }) => ({
        url: "/users/admins/bulk-delete",
        method: "POST",
        body: { ids },
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),
  }),
});

export const {
  useCreateInviteMutation,
  useGetAdminsQuery,
  useGetAdminByIdQuery,
  useDeleteAdminMutation,
  useBulkDeleteAdminsMutation,
} = usersApi;

export type {
  AdminRole,
  AdminUserItem,
  GetAdminByIdResponse,
  GetAdminsResponse,
  InviteAdminPayload,
  InviteAdminResponse,
};
