import { adminApi } from "@/lib/api/admin/admin-api";

import type {
  AdminItem,
  AdminRole,
  BulkDeactivateAdminsPayload,
  BulkDeactivateAdminsResponse,
  GetAdminByIdResponse,
  GetAdminsResponse,
  InviteAdminPayload,
  InviteAdminResponse,
} from "../types/api-types";

export const adminsApi = adminApi.injectEndpoints({
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
      invalidatesTags: [{ type: "Admins", id: "LIST" }],
    }),

    getAdmins: builder.query<GetAdminsResponse, void>({
      query: () => "/auth/admins",
      providesTags: [{ type: "Admins", id: "LIST" }],
    }),

    getAdminById: builder.query<GetAdminByIdResponse, string>({
      query: (id) => `/auth/admin/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Admins", id }],
    }),

    deactivateAdmin: builder.mutation<void, { orgSlug: string; adminId: string }>({
      query: ({ adminId }) => ({
        url: `/users/admins/${adminId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Admins", id: "LIST" }],
    }),

    bulkDeactivateAdmins: builder.mutation<
      BulkDeactivateAdminsResponse,
      BulkDeactivateAdminsPayload
    >({
      query: ({ ids }) => ({
        url: "/users/admins/bulk-delete",
        method: "POST",
        body: { ids },
      }),
      invalidatesTags: [{ type: "Admins", id: "LIST" }],
    }),
  }),
});

export const {
  useCreateInviteMutation,
  useGetAdminsQuery,
  useGetAdminByIdQuery,
  useDeactivateAdminMutation,
  useBulkDeactivateAdminsMutation,
} = adminsApi;

export type {
  AdminItem,
  AdminRole,
  GetAdminByIdResponse,
  GetAdminsResponse,
  InviteAdminPayload,
  InviteAdminResponse,
};
