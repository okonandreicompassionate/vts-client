import { Button } from "antd";
import { useState } from "react";
import DashboardHeader from "@/app/routes/admin/layout/dashboard-header";
import { Spinner } from "@/components/ui/spinner";
import TableComponent from "@/components/ui/table";
import { TablePaginationFooter } from "@/components/ui/table-pagination-footer";
import { usePopup } from "@/lib/contexts/popup/use-popup";
import { getEmployeeColumns } from "./employee-columns";
import EmployeeExcelUploadModal from "../components/modals/employee-excel-upload-modal";
import type { EmployeeRow } from "../types/types";
import { useEmployeeTableData } from "../hooks/use-employee-data";
import { UploadOutlined } from "@ant-design/icons";

export default function Employees() {
  const [page, setPage] = useState(1);

  const { openModal } = usePopup();

  const pageSize = 10;

  const { employeeRecords, totalEntries, isLoading } = useEmployeeTableData({
    page,
    limit: pageSize,
  });

  const handleOpenUploadModal = () => {
    openModal(<EmployeeExcelUploadModal />);
  };

  const columns = getEmployeeColumns(employeeRecords);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <DashboardHeader title="Employees" />

      <main className="flex-1 pb-3 sm:px-3 md:px-3 md:py-6">
        <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm shadow-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:shadow-none">
          <div className="flex items-center justify-between py-3 pe-3">
            <div className="shrink-0 px-3">
              <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Manage employees that can be visited
              </h2>
            </div>

            <Button
              type="primary"
              onClick={handleOpenUploadModal}
              className="inline-flex h-7! gap-1 rounded-sm! px-2! text-xs! font-medium!"
            >
              <UploadOutlined />
              <span>Upload Exceel sheet</span>
            </Button>
          </div>

          <div className="relative min-h-0 flex-1 overflow-auto">
            {isLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-[1px] dark:bg-slate-800/70">
                <Spinner variant="inline" overlay />
              </div>
            )}

            <TableComponent<EmployeeRow>
              columns={columns}
              dataSource={employeeRecords}
              rowKey="id"
              className="employee-table"
              size="small"
              showSerialNumber
              startIndex={(page - 1) * pageSize + 1}
            />
          </div>

          {!isLoading && (
            <TablePaginationFooter
              page={page}
              pageSize={pageSize}
              totalEntries={totalEntries}
              onPageChange={setPage}
            />
          )}
        </section>
      </main>
    </div>
  );
}
