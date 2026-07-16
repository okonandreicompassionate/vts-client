import { useState } from "react";
import { Table, ConfigProvider } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EyeOutlined, SearchOutlined, FilterOutlined } from "@ant-design/icons";
import Sidebar from "../components/Sidebar.tsx";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type VisitorStatus = "Signed In" | "Pending" | "Signed Off" | "Rejected";
type FilterTab =
  | "All"
  | "Signed In"
  | "Signed Off"
  | "Pending Approval"
  | "Rejected";

interface VisitorRecord {
  key: string;
  name: string;
  phone: string;
  avatar: string;
  host: string;
  purpose: string;
  status: VisitorStatus;
  checkIn: string;
}

/* ------------------------------------------------------------------ */
/* Hard-coded data (swap this out for your API response later)        */
/* ------------------------------------------------------------------ */

const visitorData: VisitorRecord[] = [
  {
    key: "1",
    name: "Robert Fox",
    phone: "+234 802 345 6789",
    avatar: "https://i.pravatar.cc/40?img=12",
    host: "Emma Davis",
    purpose: "Contract Discussion",
    status: "Signed In",
    checkIn: "10:30 AM",
  },
  {
    key: "2",
    name: "Jane Cooper",
    phone: "+234 802 345 6789",
    avatar: "https://i.pravatar.cc/40?img=47",
    host: "Emma Davis",
    purpose: "Contract Discussion",
    status: "Signed Off",
    checkIn: "10:30 AM",
  },
  {
    key: "3",
    name: "Guy Hawkins",
    phone: "+234 802 345 6789",
    avatar: "https://i.pravatar.cc/40?img=33",
    host: "Emma Davis",
    purpose: "Contract Discussion",
    status: "Pending",
    checkIn: "10:30 AM",
  },
  {
    key: "4",
    name: "Dianne Russell",
    phone: "+234 802 345 6789",
    avatar: "https://i.pravatar.cc/40?img=25",
    host: "Emma Davis",
    purpose: "Contract Discussion",
    status: "Rejected",
    checkIn: "10:30 AM",
  },
  {
    key: "5",
    name: "Robert Fox",
    phone: "+234 802 345 6789",
    avatar: "https://i.pravatar.cc/40?img=14",
    host: "Emma Davis",
    purpose: "Contract Discussion",
    status: "Signed In",
    checkIn: "10:30 AM",
  },
  {
    key: "6",
    name: "Jane Cooper",
    phone: "+234 802 345 6789",
    avatar: "https://i.pravatar.cc/40?img=29",
    host: "Emma Davis",
    purpose: "Contract Discussion",
    status: "Signed Off",
    checkIn: "10:30 AM",
  },
  {
    key: "7",
    name: "Guy Hawkins",
    phone: "+234 802 345 6789",
    avatar: "https://i.pravatar.cc/40?img=51",
    host: "Emma Davis",
    purpose: "Contract Discussion",
    status: "Pending",
    checkIn: "10:30 AM",
  },
  {
    key: "8",
    name: "Dianne Russell",
    phone: "+234 802 345 6789",
    avatar: "https://i.pravatar.cc/40?img=44",
    host: "Emma Davis",
    purpose: "Contract Discussion",
    status: "Rejected",
    checkIn: "10:30 AM",
  },
];

const filterTabs: FilterTab[] = [
  "All",
  "Signed In",
  "Signed Off",
  "Pending Approval",
  "Rejected",
];

/* ------------------------------------------------------------------ */
/* Status pill                                                         */
/* ------------------------------------------------------------------ */

const statusStyles: Record<VisitorStatus, string> = {
  "Signed In": "bg-emerald-50 text-emerald-500",
  Pending: "bg-orange-50 text-orange-400",
  "Signed Off": "bg-slate-100 text-slate-500",
  Rejected: "bg-rose-50 text-rose-500",
};

function StatusPill({ status }: { status: VisitorStatus }) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Table columns                                                       */
/* ------------------------------------------------------------------ */

const columns: ColumnsType<VisitorRecord> = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (_, record) => (
      <div className="flex items-center gap-3">
        <img
          src={record.avatar}
          alt={record.name}
          className="w-9 h-9 rounded-full object-cover"
        />
        <span className="text-sm font-medium text-slate-800">
          {record.name}
        </span>
      </div>
    ),
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
    render: (purpose) => (
      <span className="text-sm text-slate-500">{purpose}</span>
    ),
  },
  {
    title: "Check-In",
    dataIndex: "checkIn",
    key: "checkIn",
    render: (checkIn) => (
      <span className="text-sm text-slate-500">{checkIn}</span>
    ),
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status: VisitorStatus) => <StatusPill status={status} />,
  },
  {
    title: "Actions",
    key: "actions",
    align: "center",
    render: () => (
      <button
        type="button"
        className="w-8 h-8 inline-flex items-center justify-center rounded-full bg-sky-50 text-sky-500 hover:bg-sky-100 transition"
        aria-label="View visitor"
      >
        <EyeOutlined />
      </button>
    ),
  },
];

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */

export default function Visitors() {
  const [activeTab, setActiveTab] = useState<FilterTab>("All");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const totalPages = 104;
  const pageNumbers = [1, 2, 3];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#38bdf8",
          borderRadius: 8,
          fontFamily: "inherit",
        },
      }}
    >
      <div className="min-h-screen flex flex-col md:flex-row bg-[#EEF2F7]">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0 w-full">
          {/* Topbar */}
          <header className="min-h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 pt-3 pb-2.5 md:px-8 md:py-0">
            <h2 className="text-lg font-bold text-slate-800">Visitors</h2>
            <div className="flex items-center gap-3">
              <div className="text-right leading-tight">
                <p className="text-sm font-semibold text-slate-800">
                  Admin User
                </p>
                <p className="text-xs text-slate-400">Super Admin</p>
              </div>
              <img
                src="https://i.pravatar.cc/40?img=68"
                alt="Admin User"
                className="w-9 h-9 rounded-full object-cover"
              />
            </div>
          </header>

          <main className="flex-1 px-3 pt-2.5 pb-3 sm:px-4 md:px-8 md:py-6">
            {/* Visitors table card */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm shadow-slate-100">
              {/* Filter tabs + search row */}
              <div className="flex flex-col gap-3 px-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
                {/* Tabs, contained in their own light pill wrapper */}
                <div className="w-full overflow-x-auto rounded-lg border border-[#E6EAE8] bg-[#FAFAFA] p-1.5 sm:w-auto">
                  <div className="flex min-w-max items-center gap-1">
                    {filterTabs.map((tab) => {
                      const isActive = activeTab === tab;
                      return (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setActiveTab(tab)}
                          className={`px-4 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition ${
                            isActive
                              ? "bg-emerald-50 text-emerald-500 border border-emerald-200"
                              : "text-slate-400 hover:text-slate-600 border border-transparent"
                          }`}
                        >
                          {tab}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Search + filter, pinned to the right edge */}
                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                  <div className="relative">
                    <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-sm" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search visitors..."
                      className="pl-9 pr-3 py-2 w-full sm:w-56 rounded-lg border border-slate-200 text-sm text-slate-600 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-300"
                    />
                  </div>
                  <button
                    type="button"
                    aria-label="Filter"
                    className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 transition"
                  >
                    <FilterOutlined />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0">
                <Table<VisitorRecord>
                  columns={columns}
                  dataSource={visitorData}
                  pagination={false}
                  rowKey="key"
                  scroll={{ x: 900 }}
                  className="visitor-table"
                />
              </div>

              {/* Footer / pagination */}
              <div className="flex flex-col gap-3 px-3 py-4 border-t border-slate-100 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <p className="text-sm text-slate-400 text-center sm:text-left">
                  Showing 1 to 8 of 1,248 entries
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-500 hover:bg-slate-50 transition"
                  >
                    Previous
                  </button>
                  {pageNumbers.map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setPage(n)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
                        page === n
                          ? "bg-sky-500 text-white"
                          : "border border-slate-200 text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                  <span className="px-1 text-sm text-slate-400">...</span>
                  <button
                    type="button"
                    onClick={() => setPage(totalPages)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
                      page === totalPages
                        ? "bg-sky-500 text-white"
                        : "border border-slate-200 text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {totalPages}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-500 hover:bg-slate-50 transition"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ConfigProvider>
  );
}
