import { useRefetchVisitLists } from "../hooks/use-refetch-visit-lists";
import { useState } from "react";
import { Button } from "antd";
import {
  CheckCircleOutlined,
  FileTextOutlined,
  LoginOutlined,
  LogoutOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import {
  DataTableCard,
  FilterBar,
  PageShell,
  StatCards,
  type StatCardItem,
  RefreshButton,
} from "@/components/page";
import type { VisitorRow } from "../utils/visits";
import { useVisitorTableData } from "@/features/visits/hooks/use-visitor-table-data";
import { useVisitorStats } from "@/features/visits/hooks/use-visitor-stats";
import { getFacilityVisitorColumns } from "./visitor-columns";
import VisitorDetailsDrawer from "./drawers/visitor-details-drawer";
import { usePopup } from "@/lib/contexts/popup/use-popup";
import { useVisitorCheckActions } from "../hooks/use-visitor-check-actions";
import { useVisitReport } from "../hooks/use-visit-report";
import { useAdminAuthSession } from "@/features/auth/hooks/use-auth-session";
import { checkInRoles, checkOutRoles, hasRole } from "@/types/user-role";

type StatusKey = "ALL" | "APPROVED" | "SIGNED_IN" | "SIGNED_OFF";

export default function Visitors() {
  const refetchVisitLists = useRefetchVisitLists();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusKey>("ALL");
  const { openDrawer } = usePopup();
  const { generateVisitReport, isGeneratingReport } = useVisitReport("visitors");
  const { data: currentUser } = useAdminAuthSession();
  const canCheckIn = hasRole(currentUser?.role, checkInRoles);
  const canCheckOut = hasRole(currentUser?.role, checkOutRoles);

  // "Total" lists every visit, whatever its status.
  const listStatus = statusFilter === "ALL" ? undefined : statusFilter;
  const { visitorRecords, totalEntries, isLoading, isError, errorMessage, refetch } =
    useVisitorTableData({
      page,
      limit: pageSize,
      search,
      status: listStatus,
    });

  const summary = useVisitorStats();
  const approvedCount = summary.approved;

  const changeStatusFilter = (value: StatusKey) => {
    setStatusFilter(value);
    setPage(1);
  };

  const statItems: StatCardItem<StatusKey>[] = [
    {
      key: "ALL",
      label: "Total",
      value: summary.total,
      icon: <TeamOutlined />,
      tone: "violet",
    },
    {
      key: "APPROVED",
      label: "Approved",
      value: approvedCount,
      icon: <CheckCircleOutlined />,
      tone: "sky",
    },
    {
      key: "SIGNED_IN",
      label: "Checked In",
      value: summary.signedIn,
      icon: <LoginOutlined />,
      tone: "emerald",
    },
    {
      key: "SIGNED_OFF",
      label: "Checked Out",
      value: summary.signedOff,
      icon: <LogoutOutlined />,
      tone: "slate",
    },
  ];

  const { confirmCheckIn, confirmCheckOut, isCheckingIn, isCheckingOut } = useVisitorCheckActions();

  const openVisitor = (visitorId: string) =>
    openDrawer(<VisitorDetailsDrawer visitorId={visitorId} />);

  const columns = getFacilityVisitorColumns(statusFilter, {
    onView: (visitor) => openVisitor(visitor.id),
    onCheckIn: canCheckIn ? (visitor) => confirmCheckIn(visitor) : undefined,
    onCheckOut: canCheckOut ? (visitor) => confirmCheckOut(visitor) : undefined,
    busy: isCheckingIn || isCheckingOut,
  });

  return (
    <PageShell
      fill
      title="Visitors"
      description="Review requests and track visitor check-in and check-out times by status."
      actions={
        <>
          <RefreshButton loading={isLoading} onClick={() => void refetchVisitLists()} />
          <Button
            icon={<FileTextOutlined />}
            loading={isGeneratingReport}
            onClick={() => void generateVisitReport({ status: listStatus, search })}
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
      />

      <StatCards<StatusKey>
        items={statItems}
        activeKey={statusFilter}
        onSelect={changeStatusFilter}
      />

      <DataTableCard<VisitorRow>
        columns={columns}
        dataSource={visitorRecords}
        rowKey="id"
        className="visitor-table"
        loading={isLoading}
        error={
          isError
            ? {
                message: errorMessage ?? "Unable to load visitors.",
                onRetry: () => void refetch(),
              }
            : null
        }
        empty={
          <p className="text-sm text-slate-500 dark:text-zinc-400">No visitors with this status.</p>
        }
        onRowClick={(record) => openVisitor(record.id)}
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
