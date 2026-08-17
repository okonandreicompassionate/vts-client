import { publicApi } from "@/lib/api/public/public-api";

export const publicEmployeesApiSlice = publicApi.injectEndpoints({
  endpoints: (builder) => ({
  

    getEmployeeNames: builder.query<{ name: string }[], void>({
      query: () => ({
        url: "/employees/names",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetEmployeeNamesQuery,
} = publicEmployeesApiSlice;
