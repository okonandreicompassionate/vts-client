import { api } from "@/lib/api/api";
import { normalizeUserRole, toApiRole } from "@/types/user-role";

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

/** What the server sends for a staff user (list uses `userRole`, detail uses `role`). */
interface ApiAdmin {
  id: string;
  orgId: string;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  phone?: string | null;
  userRole?: string;
  role?: string;
  orgSlug?: string;
  organization?: { slug: string };
}

const toAdminItem = (admin: ApiAdmin): AdminItem => ({
  id: admin.id,
  orgId: admin.orgId,
  role: normalizeUserRole(admin.role ?? admin.userRole ?? "ADMIN"),
  fullName: `${admin.firstName ?? ""} ${admin.lastName ?? ""}`.trim(),
  email: admin.email,
  phoneNumber: admin.phone ?? "",
  orgSlug: admin.orgSlug ?? admin.organization?.slug,
});

export const adminsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createInvite: builder.mutation<InviteAdminResponse, InviteAdminPayload>({
      query: ({ email, role }) => ({
        url: "/invites",
        method: "POST",
        body: {
          email: email.trim().toLowerCase(),
          role: toApiRole(role),
        },
      }),
      invalidatesTags: [{ type: "Admins", id: "LIST" }],
    }),

    getAdmins: builder.query<GetAdminsResponse, void>({
      query: () => "/users/admins",
      transformResponse: (admins: ApiAdmin[]) => admins.map(toAdminItem),
      providesTags: [{ type: "Admins", id: "LIST" }],
    }),

    getAdminById: builder.query<GetAdminByIdResponse, string>({
      query: (id) => `/users/admins/${id}`,
      transformResponse: (admin: ApiAdmin): GetAdminByIdResponse => {
        const item = toAdminItem(admin);

        return { ...item, orgSlug: item.orgSlug ?? "" };
      },
      providesTags: (_result, _error, id) => [{ type: "Admins", id }],
    }),

    deactivateAdmin: builder.mutation<void, { adminId: string }>({
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
