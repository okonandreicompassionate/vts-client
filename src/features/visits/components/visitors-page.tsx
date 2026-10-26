import { useApolloClient } from "@apollo/client/react";
import { useState } from "react";
import { Button, Drawer, Input, Modal, Select, message } from "antd";
import {
  FileTextOutlined,
  LogoutOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Header from "../../../components/layout/dashboard-header";
import TableComponent from "../../../components/ui/table";
import { TablePaginationFooter } from "../../../components/ui/table-pagination-footer";
import type { VisitorRow } from "../utils/visits";
import { useVisitorTableData } from "@/features/visits/hooks/use-visitor-table-data";
import { getFacilityVisitorColumns } from "./visitor-columns";
import VisitorDetails from "./visitor-details";
import { getSelectionColumn } from "@/components/ui/selection-column";
import { Spinner } from "@/components/ui/spinner";
import type { BulkVisitIds } from "../types/api-types";
import {
  useCheckInVisitMutation,
  useCheckOutVisitMutation,
  useSignoffManyVisitsMutation,
} from "@/features/visits/api/admins-visit-api-slice";
import {
  getVisitActionErrorMessage,
  isVisitAlreadyCheckedInError,
} from "../utils/visits";

function downloadVisitorReport(visitors: VisitorRow[], page: number) {
  const columns: (keyof VisitorRow)[] = [
    "id",
    "name",
    "email",
    "phone",
    "host",
    "purpose",
    "status",
    "registeredAt",
    "checkIn",
    "checkOut",
  ];
  const escapeCsv = (value: string) => `"${value.replaceAll('"', '""')}"`;
  const rows = [
    columns.join(","),
    ...visitors.map((visitor) =>
      columns.map((column) => escapeCsv(String(visitor[column] ?? ""))).join(","),
    ),
  ];
  const blob = new Blob([`\uFEFF${rows.join("\r\n")}`], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `visitors-page-${page}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function Visitors() {
  const client = useApolloClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("APPROVED");
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedRows, setSelectedRows] = useState<VisitorRow[]>([]);
  const [drawerVisitorId, setDrawerVisitorId] = useState<string>();
  const pageSize = 8;

  const { visitorRecords, totalEntries, isLoading, isError } = useVisitorTableData({
    page,
    limit: pageSize,
    search,
    status: statusFilter,
  });

  const [checkInVisit, { isLoading: isCheckingIn }] = useCheckInVisitMutation();
  const [checkOutVisit, { isLoading: isCheckingOut }] = useCheckOutVisitMutation();
  const [signoffManyVisits, { isLoading: isSigningOff }] = useSignoffManyVisitsMutation();

  const isBulkActionRunning = isSigningOff;

  const selectedRowKeys = selectedRows.map((row) => row.id);

  const selectedStatuses = new Set(selectedRows.map((row) => row.status));
  const hasSelection = selectedRows.length > 0;
  const isMixedSelection = selectedStatuses.size > 1;
  const commonStatus = !isMixedSelection ? selectedRows[0]?.status : undefined;

  const canSignOff = hasSelection && !isMixedSelection && commonStatus === "Signed In";

  let actionHint: string | null = null;
  if (hasSelection && isMixedSelection) {
    actionHint = "Select visits with the same status to enable bulk actions.";
  } else if (hasSelection && !canSignOff) {
    actionHint = `No bulk actions available for ${commonStatus} visits.`;
  }

  const handleToggleSelection = (record: VisitorRow) => {
    setSelectedRows((current) =>
      current.some((row) => row.id === record.id)
        ? current.filter((row) => row.id !== record.id)
        : [...current, record],
    );
  };

  const handleStartSelecting = () => setIsSelecting(true);

  const handleCancelSelecting = () => {
    setSelectedRows([]);
    setIsSelecting(false);
  };

  const runBulkAction = async (
    action: (body: BulkVisitIds) => Promise<unknown>,
    successMessage: string,
    errorMessage: string,
  ) => {
    try {
      await action({ visitIds: selectedRowKeys });
      await client.refetchQueries({ include: ["Visits"] });
      message.success(successMessage);
      setSelectedRows([]);
      setIsSelecting(false);
    } catch {
      message.error(errorMessage);
    }
  };

  const handleSignOff = () => {
    const count = selectedRows.length;
    Modal.confirm({
      title: `Sign off ${count} ${count === 1 ? "visit" : "visits"}?`,
      content: "Selected visitors will be signed off.",
      okText: "Sign Off",
      onOk: () =>
        runBulkAction(
          (body) => signoffManyVisits(body).unwrap(),
          count === 1 ? "Visit signed off" : "Visits signed off",
          "Failed to sign off selected visits",
        ),
    });
  };

  const handleVisitorAction = (visitor: VisitorRow) => {
    if (visitor.status === "Approved") {
      Modal.confirm({
        title: `Check in ${visitor.name}?`,
        content: "This will mark the visitor as signed in.",
        okText: "Check In",
        onOk: async () => {
          try {
            await checkInVisit(visitor.id).unwrap();
            await client.refetchQueries({ include: ["Visits"] });
            message.success(`${visitor.name} checked in successfully.`);
          } catch (error) {
            if (isVisitAlreadyCheckedInError(error)) {
              await client.refetchQueries({ include: ["Visits"] });
              message.info(`${visitor.name} is already checked in. The list has been refreshed.`);
              return;
            }

            message.error(
              getVisitActionErrorMessage(error, "Visitor check-in could not be completed."),
            );
            throw error;
          }
        },
      });
      return;
    }

    if (visitor.status === "Signed In") {
      Modal.confirm({
        title: `Check out ${visitor.name}?`,
        content: "This will mark the visitor as signed out.",
        okText: "Check Out",
        onOk: async () => {
          try {
            await checkOutVisit(visitor.id).unwrap();
            await client.refetchQueries({ include: ["Visits"] });
            message.success(`${visitor.name} checked out successfully.`);
          } catch (error) {
            message.error(
              getVisitActionErrorMessage(error, "Visitor check-out could not be completed."),
            );
            throw error;
          }
        },
      });
      return;
    }

    setDrawerVisitorId(visitor.id);
  };

  const actionColumns = getFacilityVisitorColumns(
    handleVisitorAction,
    isCheckingIn || isCheckingOut,
  );
  const columns = isSelecting
    ? [
        getSelectionColumn<VisitorRow>({
          selectedRowKeys,
          onToggle: handleToggleSelection,
          checkboxClassName: "visitor-table-checkbox",
        }),
        ...actionColumns,
      ]
    : actionColumns;

  return (
    <>
      <Header title="Visitors" />

      <main className="flex-1 px-2 pt-1 pb-3 sm:px-2 md:px-2 md:py-3">
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Visitors</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Review requests and track visitor check-in and check-out times by status.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Select
              aria-label="Filter visitors by status"
              value={statusFilter}
              onChange={(value: string | undefined) => {
                if (!value) return;
                setStatusFilter(value);
                setPage(1);
                setSelectedRows([]);
              }}
              className="w-full sm:w-44"
              options={[
                { label: "Approved", value: "APPROVED" },
                { label: "Checked In", value: "SIGNED_IN" },
                { label: "Checked Out", value: "SIGNED_OFF" },
              ]}
            />
            <Button
              icon={<FileTextOutlined />}
              onClick={() => downloadVisitorReport(visitorRecords, page)}
              disabled={visitorRecords.length === 0}
              title="Download the visitors on the current page as a CSV report"
            >
              Generate Report
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 bg-white shadow-sm shadow-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:shadow-none">
          <div className="flex flex-col gap-3 overflow-x-auto px-3 sm:px-6 sm:py-1">
            <div className="flex flex-col gap-2 overflow-x-auto sm:flex-row sm:items-center sm:justify-between">
              <div className="flex w-full gap-2 py-2 sm:w-auto sm:flex-row sm:items-center">
                <Input
                  allowClear
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  prefix={<SearchOutlined className="text-slate-400" />}
                  placeholder="Search visitors"
                  className="w-full sm:max-w-xs"
                />
                {!isSelecting && (
                  <button
                    type="button"
                    onClick={handleStartSelecting}
                    className="flex h-5.5 items-center justify-center rounded-sm bg-sky-500 px-2 text-[12px] leading-none font-medium text-white transition-colors hover:bg-sky-600 active:bg-sky-700"
                  >
                    Select
                  </button>
                )}

                {isSelecting && (
                  <div className="flex flex-col gap-1">
                    <div className="flex h-7 items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-1.5 dark:border-slate-700 dark:bg-slate-800/60">
                      <span className="flex h-6 items-center px-1 text-[12px] leading-none font-medium text-slate-700 dark:text-slate-200">
                        {selectedRows.length} selected
                      </span>

                      <span className="h-3.5 w-px shrink-0 bg-slate-300 dark:bg-slate-600" />

                      <button
                        type="button"
                        onClick={handleCancelSelecting}
                        className="flex h-6 items-center justify-center rounded text-[11px] leading-none font-medium text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        disabled={!canSignOff || isBulkActionRunning}
                        onClick={handleSignOff}
                        className="flex h-6 cursor-pointer items-center justify-center gap-1 rounded px-1.5 text-[11px] leading-none font-medium text-sky-600 transition-colors hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-40 dark:text-sky-400 dark:hover:bg-sky-950/40"
                      >
                        <LogoutOutlined />
                        {isSigningOff ? "Signing off..." : "Sign Off"}
                      </button>
                    </div>

                    {actionHint && (
                      <span className="px-1 text-[11px] text-slate-400 dark:text-slate-500">
                        {actionHint}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>

          <div className="relative -mx-3 px-3 sm:mx-0 sm:px-0">
            <TableComponent<VisitorRow>
              columns={columns}
              dataSource={visitorRecords}
              rowKey="id"
              className="visitor-table"
              size="small"
              showSerialNumber
              serialNumberTitle="Id"
              startIndex={(page - 1) * pageSize + 1}
              onRow={
                isSelecting
                  ? () => ({ style: { cursor: "default" } })
                  : (record) => ({
                      onClick: () => setDrawerVisitorId(record.id),
                      style: { cursor: "pointer" },
                    })
              }
            />

            {isLoading && (
              <Spinner
                variant="inline"
                overlay
                className="bg-white/150 backdrop-blur-[1px] dark:bg-slate-900/70"
              />
            )}
          </div>

          {isError && (
            <div className="px-3 pb-3 sm:px-6">
              <span className="text-[13px] text-red-500">Unable to load visitors</span>
            </div>
          )}

          <TablePaginationFooter
            page={page}
            pageSize={pageSize}
            totalEntries={totalEntries}
            onPageChange={setPage}
          />
        </div>
      </main>

      <Drawer
        title="Visitor Details"
        placement="right"
        width="min(100vw, 420px)"
        open={Boolean(drawerVisitorId)}
        onClose={() => setDrawerVisitorId(undefined)}
        destroyOnClose
        styles={{ body: { padding: 0 } }}
      >
        {drawerVisitorId && (
          <VisitorDetails
            visitorId={drawerVisitorId}
            onClose={() => setDrawerVisitorId(undefined)}
          />
        )}
      </Drawer>
    </>
  );
}
