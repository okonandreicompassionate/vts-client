import { useState } from "react";
import { Button } from "antd";

import { FilterOutlined } from "@ant-design/icons";
import Header from "./layout/header";
import TableComponent from "./table";
import { TablePaginationFooter } from "./table-pagination-footer";
import type { VisitorStatus } from "./status-pill";
import { toApiVisitStatus, type VisitorRow } from "../utils/visits";
import { useVisitorTableData } from "../hooks/use-visitor-table-data";
import { useVisitorRowClick } from "../hooks/use-visitor-row-click";
import { visitorColumns } from "./visitor-columns";

type FilterTab = "All" | VisitorStatus;

const filterTabs: FilterTab[] = [
  "All",
  "Signed In",
  "Signed Off",
  "Pending",
  "Rejected",
];


export default function Visitors() {
  const [activeTab, setActiveTab] = useState<FilterTab>("All");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const pageSize = 8;
  const { visitorRecords, totalEntries } = useVisitorTableData({
    page,
    limit: pageSize,
    status:
      activeTab === "All"
        ? undefined
        : toApiVisitStatus(activeTab),
  });

  const handleRowClick = useVisitorRowClick();

  const handleTabChange = (tab: FilterTab) => {
    setActiveTab(tab);
    setPage(1);
  };

  return (
    <>
      <Header title="Visitors" />

      <main className="flex-1 px-3 pt-1 pb-3 sm:px-4 md:px-8 md:py-6">
        <div className="rounded-xl border border-slate-100 bg-white shadow-sm shadow-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:shadow-none">
          <div className="flex flex-col gap-3 px-3 sm:px-6 sm:py-1">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex py-2 w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                <Button
                  icon={<FilterOutlined />}
                  aria-label="Toggle filters"
                  onClick={() => setShowFilters((prev) => !prev)}
                  className={`h-6! ${
                    showFilters
                      ? "bg-emerald-50! text-emerald-500!"
                      : "text-slate-400!"
                  }`}
                >
                  Filter
                </Button>
              </div>
            </div>

            {showFilters && (
              <div className="overflow-x-auto rounded-lg border border-[#E6EAE8] bg-[#FAFAFA] p-1.5 dark:border-slate-700 dark:bg-slate-900">
                <div className="flex min-w-max items-center gap-1">
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

          <div className="-mx-3 px-3 sm:mx-0 sm:px-0">
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

          <TablePaginationFooter
            page={page}
            pageSize={pageSize}
            totalEntries={totalEntries}
            onPageChange={setPage}
          />
        </div>
      </main>
    </>
  );
}
