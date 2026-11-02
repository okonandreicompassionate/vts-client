export interface EmployeeApiItem {
  id: string;
  employeeId: string | null;
  firstName: string;
  lastName: string;
  email: string | null;
  role: string | null;
  department: string | null;
}

export interface EmployeeListResponse {
  items: EmployeeApiItem[];
  total: number;
  page: number;
  limit: number;
}

export interface EmployeeImportRowError {
  /** Spreadsheet row number (1-based, header is row 1). */
  row: number;
  message: string;
}

export interface EmployeeUploadResponse {
  imported: number;
  updated: number;
  skipped: number;
  errors: EmployeeImportRowError[];
}
