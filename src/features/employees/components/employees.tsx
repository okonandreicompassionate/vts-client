import { Button } from "antd";
import { FileTextOutlined, UploadOutlined } from "@ant-design/icons";
import { useState } from "react";

import { DataTableCard, FilterBar, PageShell, RefreshButton } from "@/components/page";
import { usePopup } from "@/lib/contexts/popup/use-popup";
import { fetchAllPages, useGenerateReport } from "@/hooks/use-generate-report";
import { useAppDispatch } from "@/lib/stores/hooks";
import { adminEmployeesApiSlice } from "../api/admin-employees-api-slice";
import { formatLastVisit, getEmployeeColumns } from "./employee-columns";
import EmployeeExcelUploadModal from "../components/modals/employee-excel-upload-modal";
import type { EmployeeRow } from "../types/types";
import { toEmployeeRow, useEmployeeTableData } from "../hooks/use-employee-data";

export default function Employees() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState("");

  const { openModal } = usePopup();
  const dispatch = useAppDispatch();
  const { generateReport, isGeneratingReport } = useGenerateReport();

  const { employeeRecords, totalEntries, isLoading, isFetching, isError, refetch } =
    useEmployeeTableData({ page, limit: pageSize, search });

  const columns = getEmployeeColumns(employeeRecords);

  const generateEmployeeReport = () =>
    generateReport({
      name: "employees",
      columns: [
        { header: "Employee ID", value: (row) => row.employeeId },
        { header: "Name", value: (row) => row.fullName },
        { header: "Email", value: (row) => row.email },
        { header: "Phone", value: (row) => row.phone },
        { header: "Role", value: (row) => row.role },
        { header: "Department", value: (row) => row.department },
        { header: "Access", value: (row) => row.access },
        { header: "Visitors hosted", value: (row) => row.visitorCount },
        { header: "Last visit", value: (row) => formatLastVisit(row.lastVisitAt) },
      ],
      loadRows: () =>
        fetchAllPages(async (page, limit) => {
          const result = await dispatch(
            adminEmployeesApiSlice.endpoints.getEmployees.initiate(
              { page, limit, search: search.trim() || undefined },
              { subscribe: false, forceRefetch: true },
            ),
          ).unwrap();

          return {
            rows: result.items.map(toEmployeeRow),
            hasNextPage: page * limit < result.total,
          };
        }),
    });

  return (
    <PageShell
      fill
      title="Employees"
      description="Staff that visitors can choose as their host."
      actions={
        <>
          <RefreshButton loading={isFetching} onClick={() => void refetch()} />
          <Button
            icon={<FileTextOutlined />}
            loading={isGeneratingReport}
            onClick={() => void generateEmployeeReport()}
          >
            Generate Report
          </Button>
          <Button
            type="primary"
            icon={<UploadOutlined />}
            onClick={() => openModal(<EmployeeExcelUploadModal />)}
          >
            Upload Excel sheet
          </Button>
        </>
      }
    >
      <FilterBar
        search={{
          value: search,
          onChange: (value) => {
            setSearch(value);
            setPage(1);
          },
          placeholder: "Search by name, email or Employee ID",
        }}
      />

      <DataTableCard<EmployeeRow>
        columns={columns}
        dataSource={employeeRecords}
        rowKey="id"
        className="employee-table"
        loading={isLoading}
        error={
          isError
            ? { message: "Employees could not be loaded.", onRetry: () => void refetch() }
            : null
        }
        empty={
          <>
            <p className="text-sm font-medium text-slate-700 dark:text-zinc-200">
              {search ? "No employees match your search" : "No employees yet"}
            </p>
            {!search && (
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Upload your staff spreadsheet to add hosts.
              </p>
            )}
          </>
        }
        pagination={{
          page,
          pageSize,
          total: totalEntries,
          onChange: (nextPage, nextPageSize) => {
            setPage(nextPageSize === pageSize ? nextPage : 1);
            setPageSize(nextPageSize);
          },
        }}
      />
    </PageShell>
  );
}
