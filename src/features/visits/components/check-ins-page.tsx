import { useApolloClient } from "@apollo/client/react";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  MoreOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Drawer, Dropdown, Input, Modal, message, type MenuProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";

import DashboardHeader from "@/components/layout/dashboard-header";
import TableComponent from "@/components/ui/table";
import { TablePaginationFooter } from "@/components/ui/table-pagination-footer";
import {
  getVisitActionErrorMessage,
  isVisitAlreadyCheckedInError,
  toApiVisitStatus,
  type VisitorRow,
} from "@/features/visits/utils/visits";
import { useVisitorTableData } from "@/features/visits/hooks/use-visitor-table-data";
import { filterTabs, type FilterTab } from "@/features/visits/types/visit-tabs";
import { useAdminAuthSession } from "@/features/auth/hooks/use-auth-session";
import {
  useCheckInVisitMutation,
  useCheckOutVisitMutation,
} from "@/features/visits/api/admins-visit-api-slice";
import StatusPill from "./visit-status-pill";

const PAGE_SIZE = 10;

export default function CheckInsPage() {
  const client = useApolloClient();
  const { data: currentUser } = useAdminAuthSession();
  const canReviewVisitStatuses =
    currentUser?.role === "ADMIN" || currentUser?.role === "FACILITY";
  const canReadVisitStats = currentUser?.role === "ADMIN";
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("All");
  const [selectedVisitor, setSelectedVisitor] = useState<VisitorRow | null>(null);
  const [visitorToCheckIn, setVisitorToCheckIn] = useState<VisitorRow | null>(null);
  const [visitorToCheckOut, setVisitorToCheckOut] = useState<VisitorRow | null>(null);

  const { visitorRecords, totalEntries, isLoading, isError } = useVisitorTableData({
    page,
    limit: PAGE_SIZE,
    search,
    statusGroup: canReviewVisitStatuses ? undefined : "check-ins",
    status:
      canReviewVisitStatuses && activeTab !== "All"
        ? toApiVisitStatus(activeTab)
        : undefined,
    includeStats: canReadVisitStats,
  });
  const [checkInVisit, { isLoading: isCheckingIn }] = useCheckInVisitMutation();
  const [checkOutVisit, { isLoading: isCheckingOut }] = useCheckOutVisitMutation();
  const visibleFilterTabs: FilterTab[] = canReviewVisitStatuses ? filterTabs : [];

  const handleCheckIn = async () => {
    if (!visitorToCheckIn) return;

    try {
      await checkInVisit(visitorToCheckIn.id).unwrap();
      await client.refetchQueries({ include: ["Visits"] });
      message.success(`${visitorToCheckIn.name} checked in successfully.`);
      setVisitorToCheckIn(null);
    } catch (error) {
      if (isVisitAlreadyCheckedInError(error)) {
        await client.refetchQueries({ include: ["Visits"] });
        message.info(`${visitorToCheckIn.name} is already checked in. The list has been refreshed.`);
        setVisitorToCheckIn(null);
        return;
      }

      message.error(
        getVisitActionErrorMessage(error, "Visitor check-in could not be completed. Please try again."),
      );
    }
  };

  const handleCheckOut = async () => {
    if (!visitorToCheckOut) return;

    try {
      await checkOutVisit(visitorToCheckOut.id).unwrap();
      await client.refetchQueries({ include: ["Visits"] });
      message.success(`${visitorToCheckOut.name} checked out successfully.`);
      setVisitorToCheckOut(null);
    } catch (error) {
      message.error(
        getVisitActionErrorMessage(error, "Visitor check-out could not be completed. Please try again."),
      );
    }
  };

  const handleMenuClick = (key: string, visitor: VisitorRow) => {
    if (key === "view") {
      setSelectedVisitor(visitor);
    } else if (key === "check-in" && visitor.status === "Approved") {
      setVisitorToCheckIn(visitor);
    } else if (key === "check-out" && visitor.status === "Signed In") {
      setVisitorToCheckOut(visitor);
    }
  };

  const columns: ColumnsType<VisitorRow> = [
    {
      title: "Visitor",
      dataIndex: "name",
      key: "visitor",
      render: (_name, visitor) => (
        <div className="flex min-w-32 flex-col">
          <span className="text-xs font-medium text-slate-800 dark:text-slate-100">
            {visitor.name}
          </span>
          <span className="text-[11px] text-slate-400">{visitor.email}</span>
        </div>
      ),
    },
    {
      title: "Check-in Time",
      dataIndex: "checkIn",
      key: "check-in-time",
      render: (time: string) => (
        <span className="text-xs text-slate-700 dark:text-slate-200">{time}</span>
      ),
    },
    {
      title: "Host",
      dataIndex: "host",
      key: "host",
      render: (host: string) => (
        <span className="text-xs text-slate-600 dark:text-slate-300">{host}</span>
      ),
    },
    {
      title: "Purpose",
      dataIndex: "purpose",
      key: "purpose",
      render: (purpose: string) => (
        <span className="text-xs text-slate-600 dark:text-slate-300">{purpose}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: VisitorRow["status"]) => <StatusPill status={status} />,
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_value, visitor) => {
        const items: NonNullable<MenuProps["items"]> = [
          { key: "view", label: "View Details" },
          ...(visitor.status === "Approved"
            ? [{ key: "check-in", label: "Check In Visitor" }]
            : visitor.status === "Signed In"
              ? [{ key: "check-out", label: "Check Out Visitor" }]
            : []),
        ];

        return (
          <Dropdown
            menu={{ items, onClick: ({ key }) => handleMenuClick(key, visitor) }}
            trigger={["click"]}
            disabled={isCheckingIn || isCheckingOut}
          >
            <Button
              type="text"
              size="small"
              aria-label={`Actions for ${visitor.name}`}
              icon={<MoreOutlined />}
            />
          </Dropdown>
        );
      },
    },
  ];

  const handleFilterChange = (filter: FilterTab) => {
    setActiveTab(filter);
    setPage(1);
  };

  return (
    <>
      <DashboardHeader title="Check-ins" />
      <main className="flex-1 space-y-4 px-3 pt-2 pb-5 sm:px-5 md:px-6 md:py-5">
        <div>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Check-ins</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Check in approved visitors when they arrive, then check them out when they leave.
          </p>
        </div>

        {visibleFilterTabs.length > 0 && (
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {visibleFilterTabs.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => handleFilterChange(filter)}
                aria-pressed={activeTab === filter}
                className={`flex min-w-0 items-center gap-2 rounded-xl border p-3 text-left transition-colors ${
                  activeTab === filter
                    ? "border-sky-200 bg-sky-50 dark:border-sky-800 dark:bg-sky-950/40"
                    : "border-slate-100 bg-white hover:border-slate-200 dark:border-slate-800 dark:bg-slate-800"
                }`}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-600 dark:bg-sky-400/10 dark:text-sky-300">
                  {filter === "Signed In" ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
                </span>
                <span className="truncate text-xs font-medium text-slate-700 dark:text-slate-200">
                  {filter}
                </span>
              </button>
            ))}
          </section>
        )}

        <section className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-800">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-3 sm:flex-row sm:items-center sm:justify-between sm:px-4 dark:border-slate-700">
            <Input
              allowClear
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              prefix={<SearchOutlined className="text-slate-400" />}
              placeholder="Search by name, email or purpose"
              className="sm:max-w-xs"
            />
            <span className="text-xs text-slate-500">
              {totalEntries.toLocaleString()} visitors
            </span>
          </div>

          <TableComponent<VisitorRow>
            columns={columns}
            dataSource={visitorRecords}
            rowKey="id"
            className="check-in-table"
            size="small"
            showSerialNumber
            serialNumberTitle="S/N"
            startIndex={(page - 1) * PAGE_SIZE + 1}
            onRow={(visitor) => ({
              onDoubleClick: () => setSelectedVisitor(visitor),
            })}
          />

          {isLoading && (
            <div className="px-4 py-3 text-center text-xs text-slate-500">Loading check-ins…</div>
          )}
          {isError && (
            <div role="alert" className="px-4 py-3 text-xs text-rose-600">
              Check-ins could not be loaded. Please refresh and try again.
            </div>
          )}

          <TablePaginationFooter
            page={page}
            pageSize={PAGE_SIZE}
            totalEntries={totalEntries}
            onPageChange={setPage}
          />
        </section>
      </main>

      <Modal
        title="Confirm visitor check-in"
        open={Boolean(visitorToCheckIn)}
        onCancel={() => setVisitorToCheckIn(null)}
        onOk={() => void handleCheckIn()}
        okText="Confirm Check-in"
        confirmLoading={isCheckingIn}
        okButtonProps={{ disabled: !visitorToCheckIn || visitorToCheckIn.status !== "Approved" }}
        destroyOnHidden
      >
        {visitorToCheckIn && (
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Confirm that <strong>{visitorToCheckIn.name}</strong> has arrived for{" "}
            <strong>{visitorToCheckIn.purpose}</strong>.
          </p>
        )}
      </Modal>

      <Drawer
        title="Visitor Details"
        placement="right"
        width="min(100vw, 420px)"
        open={Boolean(selectedVisitor)}
        onClose={() => setSelectedVisitor(null)}
        destroyOnHidden
      >
        {selectedVisitor && (
          <div className="space-y-4">
            <div className="rounded-lg border border-slate-100 dark:border-slate-700">
              <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-700">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {selectedVisitor.name}
                </h2>
                <p className="mt-1 text-xs text-slate-500">{selectedVisitor.email}</p>
              </div>
              <dl className="divide-y divide-slate-100 dark:divide-slate-700">
                {[
                  ["Phone Number", selectedVisitor.phone],
                  ["Host", selectedVisitor.host],
                  ["Purpose", selectedVisitor.purpose],
                  ["Status", selectedVisitor.status],
                  ["Check-in Time", selectedVisitor.checkIn],
                ].map(([label, value]) => (
                  <div key={label} className="grid grid-cols-[7rem_minmax(0,1fr)] gap-3 px-4 py-3">
                    <dt className="text-xs text-slate-500">{label}</dt>
                    <dd className="text-xs text-slate-800 dark:text-slate-100">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {selectedVisitor.status === "Approved" && (
              <Button
                type="primary"
                block
                onClick={() => {
                  setVisitorToCheckIn(selectedVisitor);
                  setSelectedVisitor(null);
                }}
              >
                Check In Visitor
              </Button>
            )}
            {selectedVisitor.status === "Signed In" && (
              <Button
                danger
                block
                onClick={() => {
                  setVisitorToCheckOut(selectedVisitor);
                  setSelectedVisitor(null);
                }}
              >
                Check Out Visitor
              </Button>
            )}
          </div>
        )}
      </Drawer>

      <Modal
        title="Confirm visitor check-out"
        open={Boolean(visitorToCheckOut)}
        onCancel={() => setVisitorToCheckOut(null)}
        onOk={() => void handleCheckOut()}
        okText="Confirm Check-out"
        confirmLoading={isCheckingOut}
        okButtonProps={{
          disabled: !visitorToCheckOut || visitorToCheckOut.status !== "Signed In",
        }}
        destroyOnHidden
      >
        {visitorToCheckOut && (
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Confirm that <strong>{visitorToCheckOut.name}</strong> is leaving after visiting{" "}
            <strong>{visitorToCheckOut.purpose}</strong>.
          </p>
        )}
      </Modal>
    </>
  );
}
