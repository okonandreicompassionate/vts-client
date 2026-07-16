import { ConfigProvider } from "antd";
import { ArrowLeftOutlined, CheckOutlined } from "@ant-design/icons";
import Sidebar from "../components/Sidebar.tsx";

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
  {
    key: "2",
    title: "Pending Approval",
    time: "09:35 AM",
    status: "done-orange",
  },
  {
    key: "3",
    title: "Approved & Signed In",
    time: "09:42 AM",
    status: "done-green",
  },
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
            <h2 className="text-lg font-bold text-slate-800">
              Visitor Details
            </h2>
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
            {/* Back link */}
            <button
              type="button"
              className="flex items-center gap-2 text-sm font-medium text-sky-500 hover:text-sky-600 transition mb-4"
            >
              <ArrowLeftOutlined className="text-xs" />
              Back to List
            </button>

            <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
              {/* Visitor profile card */}
              <div className="w-full lg:flex-1 bg-white rounded-xl border border-slate-100 shadow-sm shadow-slate-100 px-4 py-5 sm:px-6 sm:py-6 md:px-8 md:py-8">
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
                      className={`flex flex-col gap-1 px-4 py-3.5 sm:flex-row sm:items-center sm:px-5 ${
                        idx !== detailRows.length - 1
                          ? "border-b border-slate-100"
                          : ""
                      }`}
                    >
                      <span className="w-full shrink-0 text-sm text-slate-400 sm:w-40">
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
                  className="mt-6 w-full px-5 py-2.5 rounded-full bg-[#EF4444] text-white text-sm font-semibold hover:bg-rose-600 transition sm:w-auto"
                >
                  Sign Off Visitor
                </button>
              </div>

              {/* Visit timeline card */}
              <div className="w-full lg:w-80 lg:shrink-0 bg-white rounded-xl border border-slate-100 shadow-sm shadow-slate-100 px-4 py-5 sm:px-6 sm:py-6">
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
                      <div
                        className={idx !== timeline.length - 1 ? "pb-6" : ""}
                      >
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
