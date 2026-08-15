export interface EmployeeRow {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  role: string | null;
  department: string | null;
}

export interface EmployeeListResponse {
  items: EmployeeRow[];
  total: number;
  response: string;
}

export interface EmployeeUploadResponse {
  imported: number;
  skipped: number;
  errors?: Array<{
    row: number;
    message: string;
  }>;
}