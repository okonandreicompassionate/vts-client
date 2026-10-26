import type {
  VerifyIdentityPayload,
  VerifyIdentityResponse,
  CreateVisitPayload,
  CreateVisitResponse,
  HostItem,
} from "../types/api-types";
import { publicApi } from "@/lib/api/public/public-api";

const normalizeHostName = (host: HostItem): string => {
  if (typeof host.fullName === "string" && host.fullName.trim()) {
    return host.fullName.trim();
  }

  if (typeof host.name === "string" && host.name.trim()) {
    return host.name.trim();
  }

  const firstName = typeof host.firstName === "string" ? host.firstName.trim() : "";
  const lastName = typeof host.lastName === "string" ? host.lastName.trim() : "";

  return `${firstName} ${lastName}`.trim();
};

export const publicVisitsApi = publicApi.injectEndpoints({
  endpoints: (builder) => ({
    getHosts: builder.query<HostItem[], void>({
      query: () => ({
        url: "/users/hosts",
        method: "GET",
      }),
      transformResponse: (response: HostItem[] | { items?: HostItem[]; users?: HostItem[] }) => {
        const hosts = Array.isArray(response)
          ? response
          : response.items ?? response.users ?? [];

        return hosts
          .map((host) => {
            const fullName = normalizeHostName(host);
            return fullName ? { ...host, fullName } : null;
          })
          .filter((host): host is HostItem & { fullName: string } => Boolean(host))
          .filter(
            (host, index, array) =>
              array.findIndex((item) => item.fullName === host.fullName) === index,
          );
      },
    }),
    verifyVisitIdentity: builder.mutation<VerifyIdentityResponse, VerifyIdentityPayload>({
      query: (body) => ({
        url: "/visits/verify-identity",
        method: "POST",
        body,
      }),
    }),

    createVisit: builder.mutation<CreateVisitResponse, CreateVisitPayload>({
      query: (body) => ({
        url: "/visits",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Visits"],
    }),
  }),
});

export const {
  useGetHostsQuery,
  useVerifyVisitIdentityMutation,
  useCreateVisitMutation,
} = publicVisitsApi;
