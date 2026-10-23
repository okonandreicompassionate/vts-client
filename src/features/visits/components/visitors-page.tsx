import { useApolloClient } from "@apollo/client/react";
import { useState } from "react";
import { Button, Drawer, Input, Modal, message } from "antd";
import {
  CheckOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  CloseOutlined,
  FileTextOutlined,
  FilterOutlined,
  LogoutOutlined,
  SearchOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import Header from "../../../components/layout/dashboard-header";
import TableComponent from "../../../components/ui/table";
import { TablePaginationFooter } from "../../../components/ui/table-pagination-footer";
import { toApiVisitStatus, type VisitorRow } from "../utils/visits";
import { useVisitorTableData } from "@/features/visits/hooks/use-visitor-table-data";
import { useVisitorStats } from "@/features/visits/hooks/use-visitor-stats";
import { getFacilityVisitorColumns } from "./visitor-columns";
import VisitorDetails from "./visitor-details";
import { getSelectionColumn } from "@/components/ui/selection-column";
import { Spinner } from "@/components/ui/spinner";
import type { BulkVisitIds } from "../types/api-types";
import { filterTabs, type FilterTab } from "../types/visit-tabs";
import {
  useApproveManyVisitsMutation,
  useRejectManyVisitsMutation,
  useSignoffManyVisitsMutation,
} from "@/features/visits/api/admins-visit-api-slice";

type VisitorCategory = "all" | "appointments" | "check-ins";
const visitorCategories: { key: VisitorCategory; label: string }[] = [
  { key: "all", label: "All" },
  { key: "appointments", label: "Appointment" },
  { key: "check-ins", label: "Check-ins" },
];

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
  const [activeCategory, setActiveCategory] = useState<VisitorCategory>("all");
  const [activeTab, setActiveTab] = useState<FilterTab>("All");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedRows, setSelectedRows] = useState<VisitorRow[]>([]);
  const [drawerVisitorId, setDrawerVisitorId] = useState<string>();
  const pageSize = 8;
  const stats = useVisitorStats();
  const statusGroup =
    activeTab !== "All" || activeCategory === "all" ? undefined : activeCategory;

  const { visitorRecords, totalEntries, isLoading, isError } = useVisitorTableData({
    page,
    limit: pageSize,
    search,
    status: activeTab === "All" ? undefined : toApiVisitStatus(activeTab),
    statusGroup,
  });

  const [approveManyVisits, { isLoading: isApproving }] = useApproveManyVisitsMutation();
  const [rejectManyVisits, { isLoading: isRejecting }] = useRejectManyVisitsMutation();
  const [signoffManyVisits, { isLoading: isSigningOff }] = useSignoffManyVisitsMutation();

  const isBulkActionRunning = isApproving || isRejecting || isSigningOff;

  const selectedRowKeys = selectedRows.map((row) => row.id);

  const selectedStatuses = new Set(selectedRows.map((row) => row.status));
  const hasSelection = selectedRows.length > 0;
  const isMixedSelection = selectedStatuses.size > 1;
  const commonStatus = !isMixedSelection ? selectedRows[0]?.status : undefined;

  const canApproveOrReject = hasSelection && !isMixedSelection && commonStatus === "Pending";
  const canSignOff = hasSelection && !isMixedSelection && commonStatus === "Signed In";

  let actionHint: string | null = null;
  if (hasSelection && isMixedSelection) {
    actionHint = "Select visits with the same status to enable bulk actions.";
  } else if (hasSelection && !canApproveOrReject && !canSignOff) {
    actionHint = `No bulk actions available for ${commonStatus} visits.`;
  }

  const handleTabChange = (tab: FilterTab) => {
    setActiveCategory("all");
    setActiveTab(tab);
    setPage(1);
  };

  const handleCategoryChange = (category: VisitorCategory) => {
    setActiveCategory(category);
    setActiveTab("All");
    setPage(1);
    setSelectedRows([]);
    setIsSelecting(false);
  };

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

  const handleApprove = () => {
    const count = selectedRows.length;
    Modal.confirm({
      title: `Approve ${count} ${count === 1 ? "visit" : "visits"}?`,
      content: "Selected visitors will be marked as approved.",
      okText: "Approve",
      onOk: () =>
        runBulkAction(
          (body) => approveManyVisits(body).unwrap(),
          count === 1 ? "Visit approved" : "Visits approved",
          "Failed to approve selected visits",
        ),
    });
  };

  const handleReject = () => {
    const count = selectedRows.length;
    Modal.confirm({
      title: `Reject ${count} ${count === 1 ? "visit" : "visits"}?`,
      content: "Selected visitors will be marked as rejected.",
      okText: "Reject",
      okButtonProps: { danger: true },
      onOk: () =>
        runBulkAction(
          (body) => rejectManyVisits(body).unwrap(),
          count === 1 ? "Visit rejected" : "Visits rejected",
          "Failed to reject selected visits",
        ),
    });
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

  const actionColumns = getFacilityVisitorColumns((visitor) => setDrawerVisitorId(visitor.id));
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
            <p className="text-xs text-slate-500 dark:text-slate-400">View and check visitors</p>
          </div>
          <Button
            icon={<FileTextOutlined />}
            onClick={() => downloadVisitorReport(visitorRecords, page)}
            disabled={visitorRecords.length === 0}
            title="Download the visitors on the current page as a CSV report"
          >
            Generate Report
          </Button>
        </div>

        <div className="rounded-xl border border-slate-100 bg-white shadow-sm shadow-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:shadow-none">
          <div className="flex flex-col gap-3 overflow-x-auto px-3 sm:px-6 sm:py-1">
            <div className="flex gap-1 border-b border-slate-100 pt-2 dark:border-slate-700">
              {visitorCategories.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={activeCategory === key}
                  onClick={() => handleCategoryChange(key)}
                  className={`rounded-t-md border-b-2 px-3 py-2 text-xs font-medium transition-colors ${
                    activeCategory === key
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                      : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                { label: "Total", value: stats.total, tone: "blue", icon: <TeamOutlined /> },
                {
                  label: "Approved",
                  value: Math.max(
                    0,
                    stats.total - stats.pending - stats.rejected - stats.signedIn - stats.signedOff,
                  ),
                  tone: "green",
                  icon: <CheckCircleOutlined />,
                },
                { label: "Declined", value: stats.rejected, tone: "red", icon: <CloseCircleOutlined /> },
                { label: "Pending", value: stats.pending, tone: "amber", icon: <ClockCircleOutlined /> },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-2 border border-slate-100 px-3 py-2 dark:border-slate-700"
                >
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs ${
                      stat.tone === "blue"
                        ? "bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-300"
                        : stat.tone === "green"
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300"
                          : stat.tone === "red"
                            ? "bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-300"
                            : "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-300"
                    }`}
                  >
                    {stat.icon}
                  </span>
                  <div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{stat.label}</p>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                      {stat.value.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

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
                <Button
                  icon={<FilterOutlined />}
                  aria-label="Toggle filters"
                  onClick={() => setShowFilters((prev) => !prev)}
                  className={`h-6! ${
                    showFilters ? "bg-emerald-50! text-emerald-500!" : "text-slate-400!"
                  }`}
                >
                  Filter
                </Button>

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
                        disabled={!canApproveOrReject || isBulkActionRunning}
                        onClick={handleApprove}
                        className="flex h-6 cursor-pointer items-center justify-center gap-1 rounded px-1.5 text-[11px] leading-none font-medium text-emerald-600 transition-colors hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
                      >
                        <CheckOutlined />
                        {isApproving ? "Approving..." : "Approve"}
                      </button>

                      <button
                        type="button"
                        disabled={!canApproveOrReject || isBulkActionRunning}
                        onClick={handleReject}
                        className="flex h-6 cursor-pointer items-center justify-center gap-1 rounded px-1.5 text-[11px] leading-none font-medium text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 dark:text-red-400 dark:hover:bg-red-950/40 dark:hover:text-red-300"
                      >
                        <CloseOutlined />
                        {isRejecting ? "Rejecting..." : "Reject"}
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

            {showFilters && (
              <div className="overflow-x-auto rounded-lg border border-[#E6EAE8] bg-[#FAFAFA] dark:border-slate-700 dark:bg-slate-900">
                <div className="flex min-w-max items-center gap-0.5 overflow-x-auto">
                  {filterTabs.map((tab) => {
                    const isActive = activeTab === tab;
                    return (
                      <Button
                        key={tab}
                        type="text"
                        onClick={() => handleTabChange(tab)}
                        className={`rounded-md! text-sm! font-medium! whitespace-nowrap ${
                          isActive
                            ? "border! border-emerald-200! bg-emerald-50! text-emerald-500! dark:border-emerald-800! dark:bg-emerald-950/40!"
                            : "text-slate-400! hover:text-slate-600! dark:hover:text-slate-200!"
                        }`}
                      >
                        {tab}
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}
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
