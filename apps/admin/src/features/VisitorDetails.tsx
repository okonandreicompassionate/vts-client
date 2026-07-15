import { useState } from "react";
import { ConfigProvider } from "antd";
import {
  AppstoreOutlined,
  SettingOutlined,
  ArrowLeftOutlined,
  CheckOutlined,
} from "@ant-design/icons";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type TimelineStatus = "done-blue" | "done-orange" | "done-green";

interface TimelineStep {
  key: string;
  title: string;
  time: string;
  status: TimelineStatus;
}

/* ------------------------------------------------------------------ */
/* Hard-coded data (swap this out for your API response later)        */
/* ------------------------------------------------------------------ */

const visitor = {
  name: "John Alexander Doe",
  avatar: "https://i.pravatar.cc/160?img=12",
  status: "Signed In",
  fullName: "John Alexander Doe",
  email: "john.doe@techpartners.com",
  phone: "+234 812 345 6789",
  host: "Sarah Smith",
  department: "Corporate Communications",
  purpose: "Strategic Partnership Briefing",
  checkIn: "Oct 24, 2024 · 09:42 AM",
  checkOut: "---",
};

const timeline: TimelineStep[] = [
  { key: "1", title: "Registered", time: "09:30 AM", status: "done-blue" },
  { key: "2", title: "Pending Approval", time: "09:35 AM", status: "done-orange" },
  { key: "3", title: "Approved & Signed In", time: "09:42 AM", status: "done-green" },
];

const detailRows: { label: string; value: string }[] = [
  { label: "Full Name", value: visitor.fullName },
  { label: "Email Address", value: visitor.email },
  { label: "Phone Number", value: visitor.phone },
  { label: "Host Name", value: visitor.host },
  { label: "Department", value: visitor.department },
  { label: "Purpose of Visit", value: visitor.purpose },
  { label: "Check-In Time", value: visitor.checkIn },
  { label: "Check-Out Time", value: visitor.checkOut },
];

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: <AppstoreOutlined /> },
  { key: "visitors", label: "Visitors", icon: <img src="visitors.svg" alt="" /> },
  { key: "settings", label: "Settings", icon: <SettingOutlined /> },
];

/* ------------------------------------------------------------------ */
/* Timeline dot                                                        */
/* ------------------------------------------------------------------ */

const dotStyles: Record<TimelineStatus, string> = {
  "done-blue": "bg-sky-500",
  "done-orange": "bg-orange-400",
  "done-green": "bg-emerald-500",
};

function TimelineDot({ status }: { status: TimelineStatus }) {
  return (
    <span
      className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] shrink-0 ${dotStyles[status]}`}
    >
      <CheckOutlined />
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */

export default function VisitorDetails() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState("visitors");

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
      <div className="min-h-screen flex bg-[#EEF2F7]">
        {/* Sidebar */}
        <aside
          className={`${
            collapsed ? "w-20" : "w-60"
          } shrink-0 bg-white border-r border-slate-100 flex flex-col justify-between transition-all duration-200`}
        >
          <div>
            <div className="h-16 flex items-center justify-between px-5">
              {!collapsed && (
                <img src="/logo.svg" alt="Logo" className="h-3" />
              )}
              <button
                type="button"
                onClick={() => setCollapsed((c) => !c)}
                className="w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:bg-slate-50 transition"
                aria-label="Toggle sidebar"
              >
                <img src="collapse.svg" alt="" className="w-4 h-4" />
              </button>
            </div>

            <nav className="mt-4 px-3 space-y-1">
              {navItems.map((item) => {
                const isActive = activeNav === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setActiveNav(item.key)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                      isActive
                        ? "bg-sky-500 text-white shadow-sm shadow-sky-200"
                        : "text-slate-500 hover:bg-slate-50"
                    } ${collapsed ? "justify-center" : ""}`}
                  >
                    <span className="text-base">{item.icon}</span>
                    {!collapsed && <span>{item.label}</span>}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-3">
            <button
              type="button"
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-50 transition ${
                collapsed ? "justify-center" : ""
              }`}
            >
              <img src="back.svg" alt="" />
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Topbar */}
          <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8">
            <h2 className="text-lg font-bold text-slate-800">Visitor Details</h2>
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

          <main className="flex-1 px-8 py-6">
            {/* Back link */}
            <button
              type="button"
              className="flex items-center gap-2 text-sm font-medium text-sky-500 hover:text-sky-600 transition mb-4"
            >
              <ArrowLeftOutlined className="text-xs" />
              Back to List
            </button>

            <div className="flex items-start gap-6">
              {/* Visitor profile card */}
              <div className="flex-1 bg-white rounded-xl border border-slate-100 shadow-sm shadow-slate-100 px-8 py-8">
                <div className="flex flex-col items-center text-center mb-6">
                  <img
                    src={visitor.avatar}
                    alt={visitor.name}
                    className="w-20 h-20 rounded-full object-cover mb-4"
                  />
                  <h3 className="text-xl font-bold text-slate-800">
                    {visitor.name}
                  </h3>
                 <span className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-500 border border-emerald-600">
                    {visitor.status}
                  </span>
                </div>

                <div className="border border-slate-100 rounded-lg overflow-hidden">
                  {detailRows.map((row, idx) => (
                    <div
                      key={row.label}
                      className={`flex items-center px-5 py-3.5 ${
                        idx !== detailRows.length - 1
                          ? "border-b border-slate-100"
                          : ""
                      }`}
                    >
                      <span className="w-40 shrink-0 text-sm text-slate-400">
                        {row.label}
                      </span>
                      <span className="text-sm text-slate-700">
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className="mt-6 px-5 py-2.5 rounded-full bg-[#EF4444] text-white text-sm font-semibold hover:bg-rose-600 transition"
                >
                  Sign Off Visitor
                </button>
              </div>

              {/* Visit timeline card */}
              <div className="w-80 shrink-0 bg-white rounded-xl border border-slate-100 shadow-sm shadow-slate-100 px-6 py-6">
                <h3 className="text-base font-bold text-slate-800 mb-5">
                  Visit Timeline
                </h3>

                <div className="space-y-0">
                  {timeline.map((step, idx) => (
                    <div key={step.key} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <TimelineDot status={step.status} />
                        {idx !== timeline.length - 1 && (
                          <span className="w-px flex-1 bg-slate-100 my-1" />
                        )}
                      </div>
                      <div className={idx !== timeline.length - 1 ? "pb-6" : ""}>
                        <p className="text-sm font-semibold text-slate-800 leading-tight">
                          {step.title}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {step.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ConfigProvider>
  );
}