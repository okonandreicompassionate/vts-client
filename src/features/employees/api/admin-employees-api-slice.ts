import { api } from "@/lib/api/api";
import type { EmployeeListResponse, EmployeeUploadResponse } from "../types/api-types";

export const adminEmployeesApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getEmployees: builder.query<
      EmployeeListResponse,
      { page: number; limit: number; search?: string }
    >({
      query: ({ page, limit, search }) => ({
        url: "/employees",
        method: "GET",
        params: {
          page,
          limit,
          ...(search ? { search } : {}),
        },
      }),
      providesTags: ["Employees"],
    }),

    uploadEmployeeExcelSheet: builder.mutation<EmployeeUploadResponse, FormData>({
      query: (body) => ({
        url: "/employees/import",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Employees"],
    }),


  }),
});

export const {
  useGetEmployeesQuery,
  useUploadEmployeeExcelSheetMutation,
} = adminEmployeesApiSlice;
