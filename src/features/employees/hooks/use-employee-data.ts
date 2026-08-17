import { useGetEmployeesQuery } from "../api/admin-employees-api-slice";
import type { EmployeeRow } from "../types/types";

interface UseEmployeeTableDataParams {
  page: number;
  limit: number;
}

interface UseEmployeeTableDataResult {
  employeeRecords: EmployeeRow[];
  totalEntries: number;
  isLoading: boolean;
  isFetching: boolean;
}

export function useEmployeeTableData({
  page,
  limit,
}: UseEmployeeTableDataParams): UseEmployeeTableDataResult {
  const { data, isLoading, isFetching } = useGetEmployeesQuery({
    page,
    limit,
  });

  return {
  employeeRecords:
    data?.items.map((employee) => ({
      id: employee.id,
      employeeId: employee.employeeId,
      fullName: `${employee.firstName} ${employee.lastName}`.trim(),
      role: employee.role,
      department: employee.department,
    })) ?? [],
  totalEntries: data?.total ?? 0,
  isLoading,
  isFetching,
};
}