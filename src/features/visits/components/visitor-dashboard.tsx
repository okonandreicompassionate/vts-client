import { useState } from "react";
import { Drawer, Select } from "antd";
import { TablePaginationFooter } from "../../../components/ui/table-pagination-footer.tsx";
import DashboardHeader from "../../../components/layout/dashboard-header.tsx";
import TableComponent from "../../../components/ui/table.tsx";
import { toApiVisitStatus, type VisitorRow } from "../utils/visits.ts";
import { useVisitorTableData } from "@/features/visits/hooks/use-visitor-table-data.ts";
import { useVisitorStats } from "@/features/visits/hooks/use-visitor-stats.ts";
import { Spinner } from "@/components/ui/spinner.tsx";
import { getVisitorColumns } from "./visitor-columns.tsx";
import VisitorDetails from "./visitor-details.tsx";
import { statCards } from "./visitor-stat-cards.tsx";
import { useAdminAuthSession } from "@/features/auth/hooks/use-auth-session";
import type { VisitorStatus } from "./visit-status-pill.tsx";

export default function Dashboard() {
  const { data: currentUser } = useAdminAuthSession();
  const canReviewAppointments =
    currentUser?.role === "ADMIN" || currentUser?.role === "FACILITY";
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<VisitorStatus>("Approved");
  const [drawerVisitorId, setDrawerVisitorId] = useState<string>();

  const pageSize = 8;

  const { visitorRecords, totalEntries, isLoading } = useVisitorTableData({
    page,
    limit: pageSize,
    status: toApiVisitStatus(statusFilter),
    includeStats: canReviewAppointments,
  });

  const summary = useVisitorStats(canReviewAppointments);
  const columns = getVisitorColumns((visitor) => setDrawerVisitorId(visitor.id));

  const handleStatusChange = (filter: VisitorStatus) => {
    setStatusFilter(filter);
    setPage(1);
  };

  const allCardValues = [
    summary.total.toLocaleString(),
    summary.signedIn.toLocaleString(),
    summary.signedOff.toLocaleString(),
    summary.pending.toLocaleString(),
    summary.rejected.toLocaleString(),
  ];
  const visibleCards = canReviewAppointments
    ? statCards
    : statCards.filter((card) => card.filter === "All");
  const cardValues = canReviewAppointments
    ? allCardValues
    : [totalEntries.toLocaleString()];

  return (
    <>
      <DashboardHeader title="Dashboard" />

      <main className="flex-1 px-2 pt-1 pb-3 sm:px-2 md:px-2 md:py-3">
        <div className="mb-3 flex justify-end">
          <Select
            aria-label="Filter dashboard visitors by status"
            value={statusFilter}
            onChange={handleStatusChange}
            className="w-full sm:w-52"
            options={[
              { label: "Approved", value: "Approved" },
              { label: "Checked In", value: "Signed In" },
              { label: "Checked Out", value: "Signed Off" },
            ]}
          />
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {visibleCards.map((card, index) => {
            return (
              <div
                key={card.label}
                className="group flex w-full items-center gap-2 rounded-md border border-slate-100 bg-white px-2.5 py-2 text-left dark:border-slate-800 dark:bg-slate-800"
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
              </div>
            );
          })}
        </div>

        <div className="rounded-xl border border-slate-100 bg-white shadow-sm shadow-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:shadow-none">
          <div className="px-3 py-1.5 sm:px-6 sm:py-2">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Recent Visitors
            </h3>
          </div>

          <div className="relative min-h-60">
            {isLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-[1px] dark:bg-slate-800/70">
                <Spinner variant="inline" overlay />
              </div>
            )}

            <TableComponent<VisitorRow>
              columns={columns}
              dataSource={visitorRecords}
              rowKey="id"
              className="visitor-table"
              size="small"
              showSerialNumber
              startIndex={(page - 1) * pageSize + 1}
              onRow={(record) => ({
                onClick: () => setDrawerVisitorId(record.id),
                style: { cursor: "pointer" },
              })}
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
        </div>

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
      </main>
    </>
  );
}
