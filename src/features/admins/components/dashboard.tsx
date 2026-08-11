import { useState } from "react";
import { Button } from "antd";
import { ClockCircleOutlined, EyeOutlined, WarningOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { ReactNode } from "react";
import { TablePaginationFooter } from "./table-pagination-footer.tsx";

import Header from "./layout/header.tsx";
import StatusPill from "./status-pill.tsx";
import TableComponent from "./table.tsx";

import type { VisitorStatus } from "./status-pill.tsx";
import { toApiVisitStatus, type VisitorRow } from "../utils/visits.ts";

import { useVisitorTableData } from "../hooks/use-visitor-table-data.ts";
import { useVisitorRowClick } from "../hooks/use-visitor-row-click.ts";
import { useVisitorStats } from "../hooks/use-visitor-stats.ts";

import { Spinner } from "@/components/spinner.tsx";
import {
  VisitorIdentityCell,
  VisitDateTimeCell,
} from "@/features/admins/components/visitor-table-cells";

type StatusFilter = "All" | VisitorStatus;

type StatCard = {
  label: string;
  filter: StatusFilter;
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
};

const statCards: StatCard[] = [
  {
    label: "Total Visitors",
    filter: "All",
    icon: <img src="/visitors2.svg" alt="" className="h-4 w-4" />,
    iconBg: "bg-blue-50 dark:bg-blue-500/10",
    iconColor: "text-blue-500 dark:text-blue-400",
  },
  {
    label: "Currently Signed In",
    filter: "Signed In",
    icon: <img src="/check.svg" alt="" className="h-4 w-4" />,
    iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
    iconColor: "text-emerald-500 dark:text-emerald-400",
  },
  {
    label: "Signed Off",
    filter: "Signed Off",
    icon: <img src="/back.svg" alt="" className="h-4 w-4" />,
    iconBg: "bg-slate-100 dark:bg-slate-700",
    iconColor: "text-slate-500 dark:text-slate-300",
  },
  {
    label: "Pending Approval",
    filter: "Pending",
    icon: <ClockCircleOutlined />,
    iconBg: "bg-orange-50 dark:bg-orange-500/10",
    iconColor: "text-orange-400 dark:text-orange-300",
  },
  {
    label: "Rejected",
    filter: "Rejected",
    icon: <WarningOutlined />,
    iconBg: "bg-rose-50 dark:bg-rose-500/10",
    iconColor: "text-rose-400 dark:text-rose-300",
  },
];

const columns: ColumnsType<VisitorRow> = [
  {
    title: "Visitor Details",
    dataIndex: "name",
    key: "name",
    render: (_, record) => <VisitorIdentityCell name={record.name} phone={record.phone} />,
  },
  {
    title: "Host Name",
    dataIndex: "host",
    key: "host",
    render: (host) => <span className="text-xs text-slate-600 dark:text-slate-300">{host}</span>,
  },
  {
    title: "Purpose",
    dataIndex: "purpose",
    key: "purpose",
    render: (purpose) => (
      <span className="text-xs text-slate-600 dark:text-slate-300">{purpose}</span>
    ),
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) => <StatusPill status={status} />,
  },
  {
    title: "Check-In Time",
    dataIndex: "checkIn",
    key: "checkIn",
    render: (_, record) => (
      <VisitDateTimeCell date={record.checkInDate} time={record.checkInTime} />
    ),
  },
  {
    title: "Action",
    key: "action",
    align: "center",
    render: () => (
      <Button
        type="text"
        shape="circle"
        icon={<EyeOutlined />}
        aria-label="View visitor"
        className="bg-sky-50! text-sky-500! hover:bg-sky-100! dark:bg-sky-500/10! dark:text-sky-400! dark:hover:bg-sky-500/20!"
      />
    ),
  },
];

export default function Dashboard() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");

  const pageSize = 8;

  const { visitorRecords, totalEntries, isLoading } = useVisitorTableData({
    page,
    limit: pageSize,
    status: statusFilter === "All" ? undefined : toApiVisitStatus(statusFilter),
  });

  const summary = useVisitorStats();
  const handleRowClick = useVisitorRowClick();

  const handleStatusChange = (filter: StatusFilter) => {
    setStatusFilter(filter);
    setPage(1);
  };

  const cardValues = [
    summary.total.toLocaleString(),
    summary.signedIn.toLocaleString(),
    summary.signedOff.toLocaleString(),
    summary.pending.toLocaleString(),
    summary.rejected.toLocaleString(),
  ];

  return (
    <>
      <Header title="Dashboard" />

      <main className="flex-1 px-3 pt-2.5 pb-3 sm:px-4 md:px-8 md:py-6">
        <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {statCards.map((card, index) => {
            const isActive = statusFilter === card.filter;

            return (
              <button
                key={card.label}
                type="button"
                onClick={() => handleStatusChange(card.filter)}
                aria-pressed={isActive}
                className={`group flex w-full cursor-pointer items-center gap-2 rounded-md border px-2.5 py-2 text-left transition-all duration-150 hover:border-slate-300 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 active:scale-[0.99] dark:hover:border-slate-700 dark:focus-visible:ring-slate-600 ${
                  isActive
                    ? "border-slate-300 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
                    : "border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-800"
                } `}
              >
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-transform duration-150 group-hover:scale-105 ${card.iconBg} ${card.iconColor} `}
                >
                  {card.icon}
                </div>

                <div className="min-w-0">
                  <p className="text-sm leading-none font-semibold text-slate-800 dark:text-slate-100">
                    {cardValues[index]}
                  </p>

                  <p className="mt-0.5 text-[10px] leading-none text-slate-400 dark:text-slate-500">
                    {card.label}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="rounded-xl border border-slate-100 bg-white shadow-sm shadow-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:shadow-none">
          <div className="px-3 py-4 sm:px-6 sm:py-5">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Recent Visitors
            </h3>
          </div>

          <div className="w-full min-w-0">
            {isLoading ? (
              <Spinner variant="inline" />
            ) : (
              <TableComponent<VisitorRow>
                columns={columns}
                dataSource={visitorRecords}
                rowKey="id"
                className="visitor-table"
                size="small"
                showSerialNumber
                startIndex={(page - 1) * pageSize + 1}
                onRow={handleRowClick}
              />
            )}
          </div>

          {!isLoading && (
            <TablePaginationFooter
              page={page}
              pageSize={pageSize}
              totalEntries={totalEntries}
              onPageChange={setPage}
            />
          )}
        </div>
      </main>
    </>
  );
}
