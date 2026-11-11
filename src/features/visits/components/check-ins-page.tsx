import { FileTextOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import { RowActions } from "@/components/ui/row-actions";
import { getVisitorRowActions } from "../utils/visitor-row-actions";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";

import { DataTableCard, FilterBar, PageShell, RefreshButton } from "@/components/page";
import { type VisitorRow } from "@/features/visits/utils/visits";
import { useVisitorTableData } from "@/features/visits/hooks/use-visitor-table-data";
import { useAdminAuthSession } from "@/features/auth/hooks/use-auth-session";
import { checkOutRoles, hasRole } from "@/types/user-role";
import { usePopup } from "@/lib/contexts/popup/use-popup";
import { useVisitorCheckActions } from "../hooks/use-visitor-check-actions";
import { useVisitReport } from "../hooks/use-visit-report";
import VisitorSummaryDrawer from "./drawers/visitor-summary-drawer";
import { visitorColumns } from "./visitor-columns";

export default function CheckInsPage() {
  const { data: currentUser } = useAdminAuthSession();
  const canCheckOut = hasRole(currentUser?.role, checkOutRoles);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState("");
  const { openDrawer } = usePopup();
  const { confirmCheckOut, isCheckingOut } = useVisitorCheckActions();

  const tableFilters = {
    search,
    statusGroup: "check-ins" as const,
    status: "CHECKED_IN",
  };
  const { generateVisitReport, isGeneratingReport } = useVisitReport("check-ins");
  const { visitorRecords, totalEntries, isLoading, isError, refetch } = useVisitorTableData({
    page,
    limit: pageSize,
    ...tableFilters,
    includeStats: false,
  });

  const openVisitor = (visitor: VisitorRow) =>
    openDrawer(<VisitorSummaryDrawer visitor={visitor} allowCheckOut={canCheckOut} />);

  // This page is the checkout queue; check-ins happen from the Visitors page.
  const columns: ColumnsType<VisitorRow> = [
    visitorColumns.visitor(null, false),
    visitorColumns.visitorId(),
    visitorColumns.phoneNumber(),
    visitorColumns.host(),
    visitorColumns.visitDate(),
    visitorColumns.status(),
    visitorColumns.checkIn(),
    visitorColumns.actions((visitor) => (
      <RowActions
        label={visitor.name}
        {...getVisitorRowActions(visitor, {
          onView: openVisitor,
          onCheckOut: canCheckOut ? confirmCheckOut : undefined,
          busy: isCheckingOut,
        })}
      />
    )),
  ];

  const generateCheckInReport = () =>
    generateVisitReport({
      ...tableFilters,
      columns: [
        { header: "ID", value: (row) => row.id },
        { header: "Visitor", value: (row) => row.name },
        { header: "Email", value: (row) => row.email },
        { header: "Phone", value: (row) => row.phone },
        { header: "Host", value: (row) => row.host },
        { header: "Purpose", value: (row) => row.purpose },
        { header: "Status", value: (row) => row.status },
        { header: "Check-in", value: (row) => row.checkIn },
        { header: "Check-out", value: (row) => row.checkOut },
      ],
    });

  return (
    <PageShell
      fill
      title="Checkout Queue"
      description="Visitors currently checked in and waiting to be checked out."
      actions={
        <>
          <RefreshButton
            loading={isLoading}
            onClick={() => {
              void refetch().catch(() => message.error("Check-ins could not be refreshed."));
            }}
          />
          <Button
            icon={<FileTextOutlined />}
            loading={isGeneratingReport}
            onClick={() => void generateCheckInReport()}
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
          placeholder: "Search by name, email or phone",
        }}
      />

      <DataTableCard<VisitorRow>
        columns={columns}
        dataSource={visitorRecords}
        rowKey="id"
        className="check-in-table"
        loading={isLoading}
        error={
          isError
            ? {
                message: "Check-ins could not be loaded. Please refresh and try again.",
                onRetry: () => void refetch(),
              }
            : null
        }
        empty={
          <p className="text-sm text-slate-500 dark:text-zinc-400">
            {search
              ? "No checked-in visitors match your search."
              : "No visitors are currently waiting to be checked out."}
          </p>
        }
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
