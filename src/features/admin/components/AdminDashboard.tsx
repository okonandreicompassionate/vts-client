import { useState } from "react";
import { Table, Select, ConfigProvider } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  ClockCircleOutlined,
  WarningOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import Sidebar from "../components/Sidebar.tsx";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type VisitorStatus = "Signed In" | "Pending" | "Signed Off" | "Rejected";

interface VisitorRecord {
  key: string;
  name: string;
  email: string;
  avatar: string;
  host: string;
  purpose: string;
  status: VisitorStatus;
  time: string;
}

/* ------------------------------------------------------------------ */
/* Hard-coded data (swap this out for your API response later)        */
/* ------------------------------------------------------------------ */

const visitorData: VisitorRecord[] = [
  {
    key: "1",
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://i.pravatar.cc/40?img=12",
    host: "Sarah Smith",
    purpose: "Business Meeting",
    status: "Signed In",
    time: "09:45 AM",
  },
  {
    key: "2",
    name: "Alice Johnson",
    email: "alice.j@corp.com",
    avatar: "https://i.pravatar.cc/40?img=47",
    host: "Robert Brown",
    purpose: "Interview",
    status: "Pending",
    time: "10:15 AM",
  },
  {
    key: "3",
    name: "Mark Wilson",
    email: "mw@tech.io",
    avatar: "https://i.pravatar.cc/40?img=33",
    host: "Emma Davis",
    purpose: "Maintenance",
    status: "Signed Off",
    time: "08:30 AM",
  },
  {
    key: "4",
    name: "Lisa Brown",
    email: "lisa@design.co",
    avatar: "https://i.pravatar.cc/40?img=25",
    host: "Chris Lee",
    purpose: "Delivery",
    status: "Rejected",
    time: "11:00 AM",
  },
  {
    key: "5",
    name: "Kevin Hart",
    email: "kevin@media.net",
    avatar: "https://i.pravatar.cc/40?img=51",
    host: "Sarah Smith",
    purpose: "Personal Visit",
    status: "Signed In",
    time: "11:20 AM",
  },
  {
    key: "6",
    name: "Eva Green",
    email: "eva@films.com",
    avatar: "https://i.pravatar.cc/40?img=29",
    host: "Emma Davis",
    purpose: "VIP Guest",
    status: "Signed In",
    time: "11:30 AM",
  },
  {
    key: "7",
    name: "Tom Cruise",
    email: "tom@mission.com",
    avatar: "https://i.pravatar.cc/40?img=14",
    host: "Robert Brown",
    purpose: "Consultation",
    status: "Pending",
    time: "11:45 AM",
  },
  {
    key: "8",
    name: "Dana Scully",
    email: "scully@fbi.gov",
    avatar: "https://i.pravatar.cc/40?img=44",
    host: "Chris Lee",
    purpose: "Audit",
    status: "Signed Off",
    time: "07:15 AM",
  },
];

const statCards = [
  {
    label: "Total Visitors",
    value: "1,248",
    icon: (
      <img
        src="visitors2.svg"
        alt="Total Visitors"
        className="color-[#3B82F6]"
      />
    ),
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  {
    label: "Currently Signed In",
    value: "42",
    icon: (
      <img src="check.svg" alt="Total Visitors" className="color-[#3B82F6]" />
    ),
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
  },
  {
    label: "Signed Off",
    value: "1,180",
    icon: (
      <img src="back.svg" alt="Total Visitors" className="color-[#3B82F6]" />
    ),
    iconBg: "bg-slate-100",
    iconColor: "text-slate-500",
  },
  {
    label: "Pending Approval",
    value: "18",
    icon: <ClockCircleOutlined />,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-400",
  },
  {
    label: "Rejected",
    value: "8",
    icon: <WarningOutlined />,
    iconBg: "bg-rose-50",
    iconColor: "text-rose-400",
  },
];

/* ------------------------------------------------------------------ */
/* Status pill                                                         */
/* ------------------------------------------------------------------ */

const statusStyles: Record<VisitorStatus, string> = {
  "Signed In": "bg-emerald-50 text-emerald-600",
  Pending: "bg-orange-50 text-orange-500",
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
    title: "Visitor Name",
    dataIndex: "name",
    key: "name",
    render: (_, record) => (
      <div className="flex items-center gap-3">
        <img
          src={record.avatar}
          alt={record.name}
          className="w-9 h-9 rounded-full object-cover"
        />
        <div>
          <p className="text-sm font-medium text-slate-800 leading-tight">
            {record.name}
          </p>
          <p className="text-xs text-slate-400 leading-tight">{record.email}</p>
        </div>
      </div>
    ),
  },
  {
    title: "Host",
    dataIndex: "host",
    key: "host",
    render: (host) => <span className="text-sm text-slate-600">{host}</span>,
  },
  {
    title: "Purpose",
    dataIndex: "purpose",
    key: "purpose",
    render: (purpose) => (
      <span className="text-sm text-slate-600">{purpose}</span>
    ),
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status: VisitorStatus) => <StatusPill status={status} />,
  },
  {
    title: "Time",
    dataIndex: "time",
    key: "time",
    render: (time) => <span className="text-sm text-slate-600">{time}</span>,
  },
  {
    title: "Action",
    key: "action",
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

export default function Dashboard() {
  const [page, setPage] = useState(1);

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
      <div className="min-h-screen flex flex-col md:flex-row bg-[#E4E9F0]">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0 w-full">
          {/* Topbar */}
          <header className="min-h-16 bg-[#FFFFFF] border-b border-slate-100 flex items-center justify-between px-4 pt-3 pb-2.5 md:px-8 md:py-0">
            <h2 className="text-base md:text-lg font-bold text-slate-800">
              Dashboard
            </h2>
            <div className="flex items-center gap-2 md:gap-3">
              <div className="hidden sm:block text-right leading-tight">
                <p className="text-sm font-semibold text-slate-800">
                  Admin User
                </p>
                <p className="text-xs text-slate-400">Super Admin</p>
              </div>
              <img
                src="https://i.pravatar.cc/40?img=68"
                alt="Admin User"
                className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover"
              />
            </div>
          </header>

          <main className="flex-1 px-3 pt-2.5 pb-3 sm:px-4 md:px-8 md:py-6">
            {/* Stat cards */}
            <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5 mb-6">
              {statCards.map((card) => (
                <div
                  key={card.label}
                  className="bg-white rounded-xl border border-slate-100 shadow-sm shadow-slate-100 p-3 sm:p-4"
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center mb-4 ${card.iconBg} ${card.iconColor}`}
                  >
                    {card.icon}
                  </div>
                  <p className="text-xl font-bold text-slate-800">
                    {card.value}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{card.label}</p>
                </div>
              ))}
            </div>

            {/* Recent Visitors table */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm shadow-slate-100">
              <div className="flex flex-col gap-3 px-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
                <h3 className="text-base font-bold text-slate-800">
                  Recent Visitors
                </h3>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:flex sm:flex-nowrap sm:items-center sm:gap-2">
                  <Select
                    defaultValue="Status"
                    size="middle"
                    className="w-full sm:w-32 bg-[#F5FBFE]"
                    popupMatchSelectWidth={false}
                    options={[
                      { value: "Status", label: "Status" },
                      { value: "Signed In", label: "Signed In" },
                      { value: "Pending", label: "Pending" },
                      { value: "Signed Off", label: "Signed Off" },
                      { value: "Rejected", label: "Rejected" },
                    ]}
                  />
                  <Select
                    defaultValue="Time"
                    size="middle"
                    className="w-full sm:w-28 bg-[#F5FBFE]"
                    popupMatchSelectWidth={false}
                    options={[
                      { value: "Time", label: "Time" },
                      { value: "Today", label: "Today" },
                      { value: "This Week", label: "This Week" },
                      { value: "This Month", label: "This Month" },
                    ]}
                  />
                  <Select
                    defaultValue="Host Visited"
                    size="middle"
                    className="w-full sm:col-span-1 sm:w-36 bg-[#F5FBFE]"
                    popupMatchSelectWidth={false}
                    options={[
                      { value: "Host Visited", label: "Host Visited" },
                      { value: "Sarah Smith", label: "Sarah Smith" },
                      { value: "Robert Brown", label: "Robert Brown" },
                      { value: "Emma Davis", label: "Emma Davis" },
                      { value: "Chris Lee", label: "Chris Lee" },
                    ]}
                  />
                </div>
              </div>

              {/* Horizontal scroll wrapper — bleeds edge-to-edge on mobile so
                  the table scrolls cleanly instead of squishing columns.
                  No effect on desktop (sm:mx-0 restores original layout). */}
              <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                <Table<VisitorRecord>
                  columns={columns}
                  dataSource={visitorData}
                  pagination={false}
                  rowKey="key"
                  scroll={{ x: 700 }}
                  className="visitor-table "
                />
              </div>

              {/* Footer / pagination */}
              <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 border-t border-slate-100">
                <p className="text-sm text-slate-400 text-center sm:text-left">
                  Showing 1 to 8 of 24 entries
                </p>
                <div className="flex items-center justify-center sm:justify-end gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-500 hover:bg-slate-50 transition"
                  >
                    Previous
                  </button>
                  {[1, 2, 3].map((n) => (
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
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(3, p + 1))}
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
