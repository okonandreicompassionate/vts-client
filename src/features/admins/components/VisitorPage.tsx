import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Pagination } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EyeOutlined, SearchOutlined, FilterOutlined } from "@ant-design/icons";
import Header from "../components/layout/Header.tsx";
import StatusPill from "../components/StatusPill.tsx";
import TableComponent from "./Table.tsx";
import { paths } from "../../../config/paths";
import { useGetVisitsQuery } from "../api/admin-api.ts";
import type { VisitorStatus } from "./StatusPill";
import { toApiVisitStatus, toVisitorRow, type VisitorRow } from "../utils/visits";

type FilterTab = "All" | VisitorStatus;

const filterTabs: FilterTab[] = ["All", "Signed In", "Signed Off", "Pending", "Rejected"];

const columns: ColumnsType<VisitorRow> = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (_, record) => (
      <div className="flex items-center gap-3">
        <img src={record.avatar} alt={record.name} className="h-9 w-9 rounded-full object-cover" />
        <div>
          <span className="text-sm font-medium text-slate-800">{record.name}</span>
          <p className="text-xs text-slate-400">{record.email}</p>
        </div>
      </div>
    ),
  },
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    render: (id) => <span className="text-sm text-slate-500">{id}</span>,
  },
  {
    title: "Phone No.",
    dataIndex: "phone",
    key: "phone",
    render: (phone) => <span className="text-sm text-slate-500">{phone}</span>,
  },
  {
    title: "Host Name",
    dataIndex: "host",
    key: "host",
    render: (host) => <span className="text-sm text-slate-500">{host}</span>,
  },
  {
    title: "Purpose",
    dataIndex: "purpose",
    key: "purpose",
    render: (purpose) => <span className="text-sm text-slate-500">{purpose}</span>,
  },
  {
    title: "Check-In",
    dataIndex: "checkIn",
    key: "checkIn",
    render: (checkIn) => <span className="text-sm text-slate-500">{checkIn}</span>,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) => <StatusPill status={status} />,
  },
  {
    title: "Actions",
    key: "actions",
    align: "center",
    render: () => (
      <Button
        type="text"
        shape="circle"
        icon={<EyeOutlined />}
        aria-label="View visitor"
        className="bg-sky-50! text-sky-500! hover:bg-sky-100!"
      />
    ),
  },
];

export default function Visitors() {
  const [activeTab, setActiveTab] = useState<FilterTab>("All");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const pageSize = 8;
  const { data: visitsData } = useGetVisitsQuery({
    page,
    limit: pageSize,
    status: activeTab === "All" ? undefined : toApiVisitStatus(activeTab),
    search: search.trim() || undefined,
  });

  const visitorRecords = useMemo<VisitorRow[]>(
    () => visitsData?.records.map(toVisitorRow) ?? [],
    [visitsData?.records],
  );
  const totalEntries = visitsData?.total ?? 0;

  const handleRowClick = (record: VisitorRow) => ({
    onClick: () => navigate(paths.admin.visitorDetails.getHref(record.id)),
    style: { cursor: "pointer" },
  });

  const handleTabChange = (tab: FilterTab) => {
    setActiveTab(tab);
    setPage(1);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <>
      <Header title="Visitors" />

      <main className="flex-1 px-3 pt-2.5 pb-3 sm:px-4 md:px-8 md:py-6">
        <div className="rounded-xl border border-slate-100 bg-white shadow-sm shadow-slate-100">
          <div className="flex flex-col gap-3 px-3 py-4 sm:px-6 sm:py-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                <Input
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search visitors..."
                  allowClear
                  prefix={<SearchOutlined className="text-slate-300" />}
                  className="w-full rounded-lg sm:w-56"
                />
                <Button
                  icon={<FilterOutlined />}
                  aria-label="Toggle filters"
                  onClick={() => setShowFilters((prev) => !prev)}
                  className={`h-9! w-9! ${showFilters ? "bg-emerald-50! text-emerald-500!" : "text-slate-400!"}`}
                />
              </div>
            </div>

            {showFilters && (
              <div className="overflow-x-auto rounded-lg border border-[#E6EAE8] bg-[#FAFAFA] p-1.5">
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
                            ? "border! border-emerald-200! bg-emerald-50! text-emerald-500!"
                            : "text-slate-400! hover:text-slate-600!"
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

          <div className="-mx-3 overflow-x-auto px-3 sm:mx-0 sm:px-0">
            <TableComponent<VisitorRow>
              columns={columns}
              dataSource={visitorRecords}
              rowKey="id"
              scroll={{ x: 900 }}
              className="visitor-table"
              size="small"
              showSerialNumber
              startIndex={(page - 1) * pageSize + 1}
              onRow={handleRowClick}
            />
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-100 px-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-center text-sm text-slate-400 sm:text-left">
              Showing {totalEntries === 0 ? 0 : Math.min((page - 1) * pageSize + 1, totalEntries)}{" "}
              to {Math.min(page * pageSize, totalEntries)} of {totalEntries} entries
            </p>
            <Pagination
              current={page}
              pageSize={pageSize}
              total={totalEntries}
              onChange={setPage}
              showSizeChanger={false}
              className="text-center sm:text-right"
            />
          </div>
        </div>
      </main>
    </>
  );
}
