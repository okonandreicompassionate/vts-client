import type { ColumnsType } from "antd/es/table";

import type { EmployeeRow } from "../types/types";

import { EmployeeIdentityCell } from "./employee-table-cells";

const lastVisitFormat = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" });

export const formatLastVisit = (value: string | null) =>
  value ? lastVisitFormat.format(new Date(value)) : "";

const textCell = (value?: string | null) => (
  <span className="block truncate text-xs text-slate-600 dark:text-zinc-300" title={value ?? undefined}>
    {value || "—"}
  </span>
);

type OptionalField = "email" | "phone" | "role" | "department";

const optionalColumns: { field: OptionalField; title: string }[] = [
  // { field: "email", title: "Email" },
  // { field: "phone", title: "Phone" },
  { field: "role", title: "Role" },
  { field: "department", title: "Department" },
];

export function getEmployeeColumns(employees: EmployeeRow[]): ColumnsType<EmployeeRow> {
  // A column nobody on this page has filled in is just noise.
  const visibleOptional = optionalColumns.filter(({ field }) =>
    employees.some((employee) => employee[field]?.trim()),
  );

  return [
    {
      title: "Employee Name and ID",
      key: "employee",
      width: 300,
      render: (_, record) => (
        <EmployeeIdentityCell name={record.fullName} employeeId={record.email ?? ""} />
      ),
    },

    ...visibleOptional.map(({ field, title }) => ({
      title,
      dataIndex: field,
      key: field,
      render: textCell,
    })),

    {
      title: "Role",
      dataIndex: "access",
      key: "access",
      render: textCell,
    },
    {
      title: "Visitors hosted",
      dataIndex: "visitorCount",
      key: "visitorCount",
      align: "center",
      render: (count: number) => (
        <span className="text-xs font-medium text-slate-700 tabular-nums dark:text-zinc-200">
          {count.toLocaleString()}
        </span>
      ),
    },
    {
      title: "Last visit",
      dataIndex: "lastVisitAt",
      key: "lastVisitAt",
      render: (value: string | null) => textCell(formatLastVisit(value)),
    },
  ];
}
