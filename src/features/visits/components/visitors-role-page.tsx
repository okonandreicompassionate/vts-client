import { FileTextOutlined } from "@ant-design/icons";
import { Button, message, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";

import { DataTableCard, FilterBar, PageShell, RefreshButton } from "@/components/page";
import { useAdminAuthSession } from "@/features/auth/hooks/use-auth-session";
import { useVisitorTableData } from "@/features/visits/hooks/use-visitor-table-data";
import type { VisitorRow } from "@/features/visits/utils/visits";
import { usePopup } from "@/lib/contexts/popup/use-popup";
import { RowActions } from "@/components/ui/row-actions";
import { getVisitorRowActions } from "../utils/visitor-row-actions";
import { useVisitorCheckActions } from "../hooks/use-visitor-check-actions";
import VisitorSummaryDrawer from "./drawers/visitor-summary-drawer";
import Visitors from "./visitors-page";
import { statusColumns, visitorColumns } from "./visitor-columns";
import { useVisitReport } from "../hooks/use-visit-report";

function FrontDeskVisitors() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const { openDrawer } = usePopup();
  const { confirmCheckIn, confirmCheckOut, isCheckingIn, isCheckingOut } = useVisitorCheckActions();

  const tableFilters = { search, status: statusFilter, statusGroup: "check-ins" as const };
  const { generateVisitReport, isGeneratingReport } = useVisitReport("visitors");

  const { visitorRecords, totalEntries, isLoading, isError, errorMessage, refetch } =
    useVisitorTableData({
      page,
      limit: pageSize,
      ...tableFilters,
      includeStats: false,
    });

  const openVisitor = (visitor: VisitorRow) =>
    openDrawer(
      <VisitorSummaryDrawer
        visitor={visitor}
        fields={["phone", "host", "purpose", "status", "visitDate", "checkIn", "checkOut"]}
      />,
    );

  // This screen's check-out confirmation doesn't repeat the purpose.
  const handleCheckOut = (visitor: VisitorRow) =>
    confirmCheckOut(visitor, {
      copy: {
        description: (
          <>
            Confirm that <strong>{visitor.name}</strong> is leaving.
          </>
        ),
      },
    });

  const isAll = statusFilter === "ALL";
  const columns: ColumnsType<VisitorRow> = [
    visitorColumns.visitor(),
    visitorColumns.host(),
    visitorColumns.purpose(),
    visitorColumns.visitDate(),
    ...statusColumns({
      showStatus: isAll,
      showCheckIn: isAll || statusFilter === "SIGNED_IN" || statusFilter === "SIGNED_OFF",
      showCheckOut: isAll || statusFilter === "SIGNED_OFF",
    }),
    visitorColumns.actions((visitor) => (
      <RowActions
        label={visitor.name}
        {...getVisitorRowActions(visitor, {
          onView: openVisitor,
          onCheckIn: (row) => confirmCheckIn(row),
          onCheckOut: handleCheckOut,
          busy: isCheckingIn || isCheckingOut,
        })}
      />
    )),
  ];

  return (
    <PageShell
      fill
      title="Visitors"
      description="Check visitors in when they arrive and out when they leave."
      actions={
        <>
          <RefreshButton
            loading={isLoading}
            onClick={() => {
              void refetch().catch(() => message.error("Visitors could not be refreshed."));
            }}
          />
          <Button
            icon={<FileTextOutlined />}
            loading={isGeneratingReport}
            onClick={() => void generateVisitReport(tableFilters)}
          >
            Generate Report
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
          placeholder: "Search visitors",
        }}
      >
        <Select
          aria-label="Filter visitors by status"
          value={statusFilter}
          onChange={(value: string) => {
            setStatusFilter(value);
            setPage(1);
          }}
          options={[
            { label: "All Statuses", value: "ALL" },
            { label: "Pending", value: "PENDING" },
            { label: "Approved", value: "APPROVED" },
            { label: "Checked In", value: "SIGNED_IN" },
            { label: "Checked Out", value: "SIGNED_OFF" },
            { label: "Rejected", value: "REJECTED" },
          ]}
        />
      </FilterBar>

      <DataTableCard<VisitorRow>
        columns={columns}
        dataSource={visitorRecords}
        rowKey="id"
        className="front-desk-visitor-table"
        loading={isLoading}
        error={
          isError
            ? {
                message: `Visitors could not be loaded: ${errorMessage ?? "Please refresh and try again."}`,
                onRetry: () => void refetch(),
              }
            : null
        }
        empty={<p className="text-sm text-slate-500 dark:text-zinc-400">No visitors to show.</p>}
        onRowClick={openVisitor}
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

export default function VisitorsRolePage() {
  const { data: profile } = useAdminAuthSession();

  return profile?.role === "FRONTDESK" || profile?.role === "SECURITY" ? (
    <FrontDeskVisitors />
  ) : (
    <Visitors />
  );
}
