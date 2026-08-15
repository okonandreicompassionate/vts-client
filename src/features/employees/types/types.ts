export interface EmployeeRow {
  id: string;
  employeeId: string;
  fullName: string;
  role?: string | null;
  department?: string | null;
}