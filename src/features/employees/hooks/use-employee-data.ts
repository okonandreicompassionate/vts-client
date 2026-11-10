import { useGetEmployeesQuery } from "../api/admin-employees-api-slice";
import type { EmployeeListResponse } from "../types/api-types";
import type { EmployeeRow } from "../types/types";
import { formatRole } from "@/utils/format-role";

export const toEmployeeRow = (employee: EmployeeListResponse["items"][number]): EmployeeRow => ({
  id: employee.id,
  employeeId: employee.employeeId ?? "",
  fullName: `${employee.firstName} ${employee.lastName}`.trim(),
  email: employee.email,
  phone: employee.workPhone ?? employee.phone,
  role: employee.role,
  department: employee.department,
  access: formatRole(employee.userRole),
  visitorCount: employee.visitorCount,
  lastVisitAt: employee.lastVisitAt,
});

interface UseEmployeeTableDataParams {
  page: number;
  limit: number;
  search?: string;
}

export function useEmployeeTableData({ page, limit, search }: UseEmployeeTableDataParams) {
  const { data, isLoading, isFetching, isError, refetch } = useGetEmployeesQuery({
    page,
    limit,
    search: search?.trim() || undefined,
  });

  const employeeRecords: EmployeeRow[] = data?.items.map(toEmployeeRow) ?? [];

  return {
    employeeRecords,
    totalEntries: data?.total ?? 0,
    isLoading,
    isFetching,
    isError,
    refetch,
  };
}
