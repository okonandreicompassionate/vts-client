import { adminApi } from "@/lib/api/admin/admin-api";
import type { EmployeeListResponse, EmployeeUploadResponse } from "../types/api-types";

export const adminEmployeesApiSlice = adminApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmployees: builder.query<EmployeeListResponse, { page: number; limit: number }>({
      query: ({ page, limit }) => ({
        url: "/employees",
        method: "GET",
        params: {
          page,
          limit,
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
