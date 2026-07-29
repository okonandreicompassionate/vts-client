// import { baseApi } from "../../../lib/api/base";

// // follow api integration pattern for other integrations in admin and visitor features
// // this is just a mock boilerplate
// export type Visitor = { id: string; fullName: string; status: string };
// export type GetVisitorsParams = { status?: string };

// export const visitorsApi = baseApi.injectEndpoints({
//   endpoints: (build) => ({
//     getVisitors: build.query<Visitor[], GetVisitorsParams>({
//       query: (params) => ({ url: "/visitors", params }),
//       providesTags: (result) =>
//         result
//           ? [
//               ...result.map(({ id }) => ({ type: "Visitor" as const, id })),
//               { type: "Visitor" as const, id: "LIST" },
//             ]
//           : [{ type: "Visitor" as const, id: "LIST" }],
//     }),
//   }),
// });

// export const { useGetVisitorsQuery } = visitorsApi;