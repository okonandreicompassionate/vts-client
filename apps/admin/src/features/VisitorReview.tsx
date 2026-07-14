import { useState } from "react";
import { ConfigProvider } from "antd";
import {
  AppstoreOutlined,
  SettingOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";

/* ------------------------------------------------------------------ */
/* Hard-coded data (swap this out for your API response later)        */
/* ------------------------------------------------------------------ */

const visitor = {
  name: "Alice Mary Johnson",
  avatar: "https://i.pravatar.cc/160?img=47",
  status: "Pending",
  visitorName: "Alice Mary Johnson",
  email: "alice.j@partnercorp.com",
  phone: "+234 901 234 5678",
  host: "Robert Brown",
  department: "IT Infrastructure",
  purpose: "Network Hardware Delivery",
  checkIn: "Oct 24, 2024 · 10:15 AM (Requested)",
};

const detailRows: { label: string; value: string }[] = [
  { label: "Visitor Name", value: visitor.visitorName },
  { label: "Email Address", value: visitor.email },
  { label: "Phone Number", value: visitor.phone },
  { label: "Host Name", value: visitor.host },
  { label: "Department", value: visitor.department },
  { label: "Purpose of Visit", value: visitor.purpose },
  { label: "Check-In Time", value: visitor.checkIn },
];

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: <AppstoreOutlined /> },
  { key: "visitors", label: "Visitors", icon: <img src="visitors.svg" alt="" /> },
  { key: "settings", label: "Settings", icon: <SettingOutlined /> },
];

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */

export default function ReviewVisitor() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState("visitors");
  const [notes, setNotes] = useState("");

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
            <h2 className="text-lg font-bold text-slate-800">Review Visitor</h2>
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
              {/* Visitor details card */}
              <div className="flex-1 bg-white rounded-xl border border-slate-100 shadow-sm shadow-slate-100 px-7 py-7">
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={visitor.avatar}
                    alt={visitor.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-base font-bold text-slate-800 leading-tight">
                      {visitor.name}
                    </h3>
                    <span className="mt-1.5 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-400">
                      {visitor.status}
                    </span>
                  </div>
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
              </div>

              {/* Review and approve card */}
              <div className="w-96 shrink-0 bg-white rounded-xl border border-slate-100 shadow-sm shadow-slate-100 px-6 py-6">
                <h3 className="text-base font-bold text-slate-800 mb-2">
                  Review and Approve
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-5">
                  Please verify the visitor information before granting
                  access to the building. You can add internal notes below
                  for audit purposes.
                </p>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter notes here.."
                  rows={4}
                  className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-600 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-300 mb-5"
                />

                <button
                  type="button"
                  className="w-full py-3 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition mb-3"
                >
                  Approve Access
                </button>
                <button
                  type="button"
                  className="w-full py-3 rounded-lg border border-rose-300 text-rose-500 text-sm font-semibold hover:bg-rose-50 transition"
                >
                  Reject Visitor
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ConfigProvider>
  );
}