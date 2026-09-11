import { publicApi } from "@/lib/api/public/public-api";

type EmployeeNameItem = {
  name?: unknown;
  firstName?: unknown;
  lastName?: unknown;
};

type EmployeeNameResponse =
  Array<EmployeeNameItem | string> | { items?: Array<EmployeeNameItem | string> };

const getEmployeeName = (employee: EmployeeNameItem | string): string => {
  if (typeof employee === "string") {
    return employee.trim();
  }

  if (typeof employee.name === "string") {
    return employee.name.trim();
  }

  const firstName = typeof employee.firstName === "string" ? employee.firstName.trim() : "";
  const lastName = typeof employee.lastName === "string" ? employee.lastName.trim() : "";

  return `${firstName} ${lastName}`.trim();
};

export const publicEmployeesApiSlice = publicApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmployeeNames: builder.query<{ name: string }[], void>({
      query: () => ({
        url: "/employees/names",
        method: "GET",
      }),
      transformResponse: (response: EmployeeNameResponse) => {
        const employees = Array.isArray(response) ? response : (response.items ?? []);

        return employees
          .map((employee) => ({ name: getEmployeeName(employee) }))
          .filter((employee) => employee.name.length > 0);
      },
    }),
  }),
});

export const { useGetEmployeeNamesQuery } = publicEmployeesApiSlice;
