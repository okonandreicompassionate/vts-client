import type { ColumnsType } from "antd/es/table";

import type { EmployeeRow } from "../types/types";

import { EmployeeIdentityCell } from "./employee-table-cells";

export function getEmployeeColumns(
  employees: EmployeeRow[],
): ColumnsType<EmployeeRow> {
  const hasRole = employees.some((employee) => employee.role?.trim());

  const hasDepartment = employees.some(
    (employee) => employee.department?.trim(),
  );

  return [
    {
      title: "Employee",
      key: "employee",
      render: (_, record) => (
        <EmployeeIdentityCell
          name={record.fullName}
          employeeId={record.employeeId}
        />
      ),
    },

    ...(hasRole
      ? [
          {
            title: "Role",
            dataIndex: "role",
            key: "role",
            render: (role?: string | null) => (
              <span className="text-xs text-slate-600 dark:text-slate-300">
                {role ?? ""}
              </span>
            ),
          },
        ]
      : []),

    ...(hasDepartment
      ? [
          {
            title: "Department",
            dataIndex: "department",
            key: "department",
            render: (department?: string | null) => (
              <span className="text-xs text-slate-600 dark:text-slate-300">
                {department ?? ""}
              </span>
            ),
          },
        ]
      : []),
  ];
}