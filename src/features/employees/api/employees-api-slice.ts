import type { EmployeeListResponse, EmployeeUploadResponse } from "../types/api-types";
import { api } from "@/lib/api/base";

export const employeesApiSlice = api.injectEndpoints({
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

    getEmployeeNames: builder.query<{ name: string }[], void>({
      query: () => ({
        url: "/employees/names",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useUploadEmployeeExcelSheetMutation,
  useGetEmployeeNamesQuery,
} = employeesApiSlice;
