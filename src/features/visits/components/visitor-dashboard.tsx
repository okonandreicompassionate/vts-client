import { useState } from "react";
import { TablePaginationFooter } from "../../../components/ui/table-pagination-footer.tsx";
import DashboardHeader from "../../../components/layout/dashboard-header.tsx";
import TableComponent from "../../../components/ui/table.tsx";
import { toApiVisitStatus, type VisitorRow } from "../utils/visits.ts";
import { useVisitorTableData } from "@/features/visits/hooks/use-visitor-table-data.ts";
import { useVisitorRowClick } from "@/features/visits/hooks/use-visitor-row-click.ts";
import { useVisitorStats } from "@/features/visits/hooks/use-visitor-stats.ts";
import { Spinner } from "@/components/ui/spinner.tsx";
import { visitorColumns } from "./visitor-columns.tsx";
import { statCards, type StatusFilter } from "./visitor-stat-cards.tsx";


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
      <DashboardHeader title="Dashboard" />

      <main className="flex-1 px-2 pt-1 pb-3 sm:px-2 md:px-2 md:py-3">
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
                    ? "border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
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
              columns={visitorColumns}
              dataSource={visitorRecords}
              rowKey="id"
              className="visitor-table"
              size="small"
              showSerialNumber
              startIndex={(page - 1) * pageSize + 1}
              onRow={handleRowClick}
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
      </main>
    </>
  );
}
