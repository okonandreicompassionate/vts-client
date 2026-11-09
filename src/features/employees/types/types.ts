export interface EmployeeRow {
  id: string;
  employeeId: string;
  fullName: string;
  email?: string | null;
  phone?: string | null;
  role?: string | null;
  department?: string | null;
  access: string;
  visitorCount: number;
  lastVisitAt: string | null;
}