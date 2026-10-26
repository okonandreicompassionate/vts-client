import { useApolloClient } from "@apollo/client/react";
import { SearchOutlined, SyncOutlined } from "@ant-design/icons";
import { Button, Drawer, Input, message, Modal, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";

import DashboardHeader from "@/components/layout/dashboard-header";
import TableComponent from "@/components/ui/table";
import { TablePaginationFooter } from "@/components/ui/table-pagination-footer";
import { useAdminAuthSession } from "@/features/auth/hooks/use-auth-session";
import {
  useCheckInVisitMutation,
  useCheckOutVisitMutation,
} from "@/features/visits/api/admins-visit-api-slice";
import { useVisitorTableData } from "@/features/visits/hooks/use-visitor-table-data";
import {
  getVisitActionErrorMessage,
  isVisitAlreadyCheckedInError,
  type VisitorRow,
} from "@/features/visits/utils/visits";
import StatusPill from "./visit-status-pill";
import Visitors from "./visitors-page";
import { VisitorCheckoutTime } from "./visitor-checkout-time";

const PAGE_SIZE = 10;

function FrontDeskVisitors() {
  const client = useApolloClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedVisitor, setSelectedVisitor] = useState<VisitorRow | null>(null);
  const [visitorToCheckIn, setVisitorToCheckIn] = useState<VisitorRow | null>(null);
  const [visitorToCheckOut, setVisitorToCheckOut] = useState<VisitorRow | null>(null);

  const {
    visitorRecords,
    totalEntries,
    isLoading,
    isError,
    errorMessage,
    refetch,
  } = useVisitorTableData({
    page,
    limit: PAGE_SIZE,
    search,
    status: statusFilter,
    statusGroup: "check-ins",
    includeStats: false,
  });
  const [checkInVisit, { isLoading: isCheckingIn }] = useCheckInVisitMutation();
  const [checkOutVisit, { isLoading: isCheckingOut }] = useCheckOutVisitMutation();

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

  const columns: ColumnsType<VisitorRow> = [
    {
      title: "Visitor",
      dataIndex: "name",
      key: "visitor",
      width: 175,
      render: (_name, visitor) => (
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-[11px] font-medium text-slate-800 dark:text-slate-100">
            {visitor.name}
          </span>
          <span className="truncate text-[10px] text-slate-400" title={visitor.email}>
            {visitor.email}
          </span>
        </div>
      ),
    },
    {
      title: "Host",
      dataIndex: "host",
      key: "host",
      width: 120,
      render: (host: string) => (
        <span className="block truncate text-[11px] text-slate-600 dark:text-slate-300" title={host}>
          {host}
        </span>
      ),
    },
    {
      title: "Purpose",
      dataIndex: "purpose",
      key: "purpose",
      width: 110,
      render: (purpose: string) => (
        <span className="block truncate text-[11px] text-slate-600 dark:text-slate-300" title={purpose}>
          {purpose}
        </span>
      ),
    },
    {
      title: "Visit Date",
      dataIndex: "time",
      key: "visit-date",
      width: 140,
      render: (time: string) => (
        <span className="whitespace-nowrap text-[11px] text-slate-600 dark:text-slate-300">{time}</span>
      ),
    },
    {
      title: "Check-In Time",
      dataIndex: "checkIn",
      key: "check-in",
      width: 130,
      render: (time: string) => (
        <span className="whitespace-nowrap text-[11px] text-slate-600 dark:text-slate-300">{time}</span>
      ),
    },
    {
      title: "Check-Out Time",
      dataIndex: "checkOut",
      key: "check-out",
      width: 130,
      render: (_time: string, visitor) => (
        <span className="whitespace-nowrap text-[11px] text-slate-600 dark:text-slate-300">
          <VisitorCheckoutTime visitor={visitor} />
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: VisitorRow["status"]) => <StatusPill status={status} />,
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      width: 150,
      render: (_value, visitor) => (
        <div className="flex items-center justify-center gap-1">
          <Button
            size="small"
            className="h-6! w-[52px]! px-1! text-[10px]!"
            onClick={() => setSelectedVisitor(visitor)}
          >
            View
          </Button>
          {visitor.status === "Approved" && (
            <Button
              size="small"
              type="primary"
              className="h-6! w-[76px]! px-1! text-[10px]!"
              onClick={() => setVisitorToCheckIn(visitor)}
              disabled={isCheckingIn}
            >
              Check In
            </Button>
          )}
          {visitor.status === "Signed In" && (
            <Button
              size="small"
              danger
              className="h-6! w-[76px]! px-1! text-[10px]!"
              onClick={() => setVisitorToCheckOut(visitor)}
              disabled={isCheckingOut}
            >
              Check Out
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <DashboardHeader title="Visitors" />
      <main className="flex-1 space-y-4 px-3 pt-2 pb-5 sm:px-5 md:px-6 md:py-5">
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
              placeholder="Search visitors"
              className="sm:max-w-xs"
            />
            <div className="flex gap-2">
              <Select
                aria-label="Filter visitors by status"
                value={statusFilter}
                onChange={(value: string) => {
                  setStatusFilter(value);
                  setPage(1);
                }}
                className="w-full sm:w-44"
                options={[
                  { label: "All Statuses", value: "ALL" },
                  { label: "Pending", value: "PENDING" },
                  { label: "Approved", value: "APPROVED" },
                  { label: "Checked In", value: "SIGNED_IN" },
                  { label: "Checked Out", value: "SIGNED_OFF" },
                  { label: "Rejected", value: "REJECTED" },
                ]}
              />
              <Button
                icon={<SyncOutlined />}
                loading={isLoading}
                onClick={() => {
                  void refetch().catch(() =>
                    message.error("Visitors could not be refreshed."),
                  );
                }}
                aria-label="Refresh visitors"
              >
                Refresh
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <TableComponent<VisitorRow>
              columns={columns}
              dataSource={visitorRecords}
              rowKey="id"
              className="front-desk-visitor-table"
              size="small"
              showSerialNumber
              serialNumberTitle="S/N"
              startIndex={(page - 1) * PAGE_SIZE + 1}
              onRow={(visitor) => ({ onDoubleClick: () => setSelectedVisitor(visitor) })}
            />
          </div>
          {isLoading && (
            <div className="px-4 py-3 text-center text-xs text-slate-500">Loading visitors…</div>
          )}
          {isError && (
            <div role="alert" className="px-4 py-3 text-xs text-rose-600">
              Visitors could not be loaded: {errorMessage ?? "Please refresh and try again."}
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
            Confirm that <strong>{visitorToCheckOut.name}</strong> is leaving.
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
                  ["Visit Date", selectedVisitor.time],
                  ["Check-in Time", selectedVisitor.checkIn],
                  ["Check-out Time", selectedVisitor.checkOut],
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
          </div>
        )}
      </Drawer>
    </>
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
