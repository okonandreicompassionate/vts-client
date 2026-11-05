import {
  CheckCircleOutlined,
  FileTextOutlined,
  LoginOutlined,
  LogoutOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Button, message } from "antd";
import { RowActions } from "@/components/ui/row-actions";
import { getVisitorRowActions } from "../utils/visitor-row-actions";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";

import {
  DataTableCard,
  FilterBar,
  PageShell,
  StatCards,
  type StatCardItem,
  type StatTone,
  RefreshButton,
} from "@/components/page";
import { type VisitorRow } from "@/features/visits/utils/visits";
import { useVisitorTableData } from "@/features/visits/hooks/use-visitor-table-data";
import { useAdminAuthSession } from "@/features/auth/hooks/use-auth-session";
import { adminRoles, hasRole, reviewerRoles } from "@/types/user-role";
import { useGetVisitStatsQuery } from "@/features/visits/api/admins-visit-api-slice";
import { usePopup } from "@/lib/contexts/popup/use-popup";
import { useVisitorCheckActions } from "../hooks/use-visitor-check-actions";
import { useVisitReport } from "../hooks/use-visit-report";
import VisitorSummaryDrawer from "./drawers/visitor-summary-drawer";
import type { VisitStats } from "@/features/visits/types/api-types";
import { statusColumns, visitorColumns } from "./visitor-columns";

/** The gate stages. Pending and rejected requests are handled on Appointments. */
type GateTab = "All" | "Approved" | "Signed In" | "Signed Off";

/** `status` is sent as is: the server filters and pages, so every page is full. */
const GATE_CARDS: Record<
  GateTab,
  {
    label: string;
    icon: React.ReactNode;
    tone: StatTone;
    status: string;
    count: (stats: VisitStats) => number;
  }
> = {
  All: {
    label: "Total",
    icon: <TeamOutlined />,
    tone: "violet",
    status: "APPROVED,CHECKED_IN,CHECKED_OUT",
    count: (s) => s.approved + s.signedIn + s.signedOff,
  },
  Approved: {
    label: "Expected",
    icon: <CheckCircleOutlined />,
    tone: "sky",
    status: "APPROVED",
    count: (s) => s.approved,
  },
  "Signed In": {
    label: "Checked In",
    icon: <LoginOutlined />,
    tone: "emerald",
    status: "CHECKED_IN",
    count: (s) => s.signedIn,
  },
  "Signed Off": {
    label: "Checked Out",
    icon: <LogoutOutlined />,
    tone: "slate",
    status: "CHECKED_OUT",
    count: (s) => s.signedOff,
  },
};
const GATE_TABS = Object.keys(GATE_CARDS) as GateTab[];

export default function CheckInsPage() {
  const { data: currentUser } = useAdminAuthSession();
  const canReviewVisitStatuses = hasRole(currentUser?.role, reviewerRoles);
  const canReadVisitStats = hasRole(currentUser?.role, adminRoles);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<GateTab>("Approved");
  const { openDrawer } = usePopup();
  const { confirmCheckIn, confirmCheckOut, isCheckingIn, isCheckingOut } = useVisitorCheckActions();

  const tableFilters = {
    search,
    statusGroup: canReviewVisitStatuses ? undefined : ("check-ins" as const),
    status: canReviewVisitStatuses ? GATE_CARDS[activeTab].status : undefined,
  };
  const { generateVisitReport, isGeneratingReport } = useVisitReport("check-ins");
  const { visitorRecords, totalEntries, isLoading, isError, refetch } = useVisitorTableData({
    page,
    limit: pageSize,
    ...tableFilters,
    includeStats: canReadVisitStats,
  });
  const { data: stats } = useGetVisitStatsQuery(undefined, { skip: !canReviewVisitStatuses });

  const openVisitor = (visitor: VisitorRow) =>
    openDrawer(<VisitorSummaryDrawer visitor={visitor} allowCheckOut />);

  const showsAllStages = !canReviewVisitStatuses || activeTab === "All";

  // Purpose is in the drawer; at the gate the phone number is what staff need.
  const columns: ColumnsType<VisitorRow> = [
    visitorColumns.visitor("phone"),
    visitorColumns.host(),
    ...statusColumns({
      // "Total", and the card-less view non-reviewers get, mix every gate stage.
      showStatus: showsAllStages,
      showCheckIn: showsAllStages || activeTab !== "Approved",
      showCheckOut: showsAllStages || activeTab === "Signed Off",
    }),
    visitorColumns.actions((visitor) => (
      <RowActions
        label={visitor.name}
        {...getVisitorRowActions(visitor, {
          onView: openVisitor,
          onCheckIn: confirmCheckIn,
          onCheckOut: confirmCheckOut,
          busy: isCheckingIn || isCheckingOut,
        })}
      />
    )),
  ];

  const handleFilterChange = (filter: GateTab) => {
    setActiveTab(filter);
    setPage(1);
  };

  const statItems: StatCardItem<GateTab>[] = canReviewVisitStatuses
    ? GATE_TABS.map((tab) => {
        const { label, icon, tone, count } = GATE_CARDS[tab];
        return { key: tab, label, icon, tone, value: stats ? count(stats) : "—" };
      })
    : [];

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
      title="Check-ins"
      description="Check in approved visitors when they arrive, then check them out when they leave."
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
          placeholder: "Search by name, email or purpose",
        }}
      />

      {statItems.length > 0 && (
        <StatCards<GateTab> items={statItems} activeKey={activeTab} onSelect={handleFilterChange} />
      )}

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
            {search ? "No visitors match your search." : "No visitors to check in right now."}
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
