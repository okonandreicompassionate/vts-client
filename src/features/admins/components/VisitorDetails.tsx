import { ArrowLeftOutlined, CheckOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/layout/Header.tsx";
import { paths } from "../../../config/paths";
import { useGetVisitsQuery } from "../api/auth-api";
import { toVisitorRow, type VisitorRow } from "../utils/visits";

type TimelineStatus = "done-blue" | "done-orange" | "done-green";

interface TimelineStep {
  key: string;
  title: string;
  time: string;
  status: TimelineStatus;
}

const dotStyles: Record<TimelineStatus, string> = {
  "done-blue": "bg-sky-500",
  "done-orange": "bg-orange-400",
  "done-green": "bg-emerald-500",
};

function TimelineDot({ status }: { status: TimelineStatus }) {
  return (
    <span
      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] text-white ${dotStyles[status]}`}
    >
      <CheckOutlined />
    </span>
  );
}

export default function VisitorDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: visitsData } = useGetVisitsQuery({
    page: 1,
    limit: 20,
    search: id,
  });

  const visitor = useMemo<VisitorRow>(() => {
    const visitorRecords: VisitorRow[] = visitsData?.records.map(toVisitorRow) ?? [];

    return (
      visitorRecords.find((item) => item.id === id) ??
      visitorRecords[0] ?? {
        id: id ?? "unknown",
        name: "Visitor unavailable",
        email: "N/A",
        phone: "N/A",
        avatar: "https://i.pravatar.cc/40?img=1",
        host: "N/A",
        purpose: "N/A",
        status: "Pending",
        time: "Pending",
        checkIn: "Pending",
        checkOut: "Pending",
        department: "N/A",
      }
    );
  }, [id, visitsData?.records]);

  const statusStyles: Record<string, string> = {
    "Signed In": "bg-emerald-50 text-emerald-500 border border-emerald-200",
    Pending: "bg-orange-50 text-orange-400 border border-orange-200",
    "Signed Off": "bg-slate-100 text-slate-500 border border-slate-200",
    Rejected: "bg-rose-50 text-rose-500 border border-rose-200",
  };

  const timeline: TimelineStep[] = [
    { key: "1", title: "Registration received", time: visitor.time, status: "done-blue" },
    {
      key: "2",
      title:
        visitor.status === "Pending"
          ? "Awaiting approval"
          : visitor.status === "Rejected"
            ? "Approval rejected"
            : "Approved for entry",
      time: visitor.status === "Pending" ? "Pending review" : visitor.checkIn,
      status:
        visitor.status === "Rejected"
          ? "done-orange"
          : visitor.status === "Signed In" || visitor.status === "Signed Off"
            ? "done-green"
            : "done-orange",
    },
    {
      key: "3",
      title:
        visitor.status === "Signed Off"
          ? "Signed out"
          : visitor.status === "Signed In"
            ? "Currently signed in"
            : visitor.status === "Rejected"
              ? "Visit rejected"
              : "Pending confirmation",
      time:
        visitor.status === "Signed Off"
          ? visitor.time
          : visitor.status === "Signed In"
            ? visitor.checkIn
            : "Pending",
      status:
        visitor.status === "Signed Off"
          ? "done-green"
          : visitor.status === "Signed In"
            ? "done-green"
            : visitor.status === "Rejected"
              ? "done-orange"
              : "done-orange",
    },
  ];

  const detailRows: { label: string; value: string }[] = [
    { label: "Visitor ID", value: visitor.id },
    { label: "Full Name", value: visitor.name },
    { label: "Email Address", value: visitor.email },
    { label: "Phone Number", value: visitor.phone },
    { label: "Host Name", value: visitor.host },
    { label: "Department", value: visitor.department },
    { label: "Purpose of Visit", value: visitor.purpose },
    { label: "Check-In Time", value: visitor.checkIn },
    { label: "Check-Out Time", value: visitor.status === "Signed Off" ? visitor.time : "Pending" },
  ];

  return (
    <>
      <Header title="Visitor Details" />

      <main className="flex-1 px-3 pt-2.5 pb-3 sm:px-4 md:px-8 md:py-6">
        <Button
          type="link"
          icon={<ArrowLeftOutlined className="text-xs" />}
          className="mb-4 px-0! font-medium text-sky-500!"
          onClick={() => navigate(paths.admin.visitors.getHref())}
        >
          Back to List
        </Button>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <div className="w-full rounded-xl border border-slate-100 bg-white px-4 py-5 shadow-sm shadow-slate-100 sm:px-6 sm:py-6 md:px-8 md:py-8 lg:flex-1">
            <div className="mb-6 flex flex-col items-center text-center">
              <img
                src={visitor.avatar}
                alt={visitor.name}
                className="mb-4 h-20 w-20 rounded-full object-cover"
              />
              <h3 className="text-xl font-bold text-slate-800">{visitor.name}</h3>
              <span
                className={`mt-2 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusStyles[visitor.status]}`}
              >
                {visitor.status}
              </span>
            </div>

            <div className="overflow-hidden rounded-lg border border-slate-100">
              {detailRows.map((row, idx) => (
                <div
                  key={row.label}
                  className={`flex flex-col gap-1 px-4 py-3.5 sm:flex-row sm:items-center sm:px-5 ${idx !== detailRows.length - 1 ? "border-b border-slate-100" : ""}`}
                >
                  <span className="w-full shrink-0 text-sm text-slate-400 sm:w-40">
                    {row.label}
                  </span>
                  <span className="text-sm text-slate-700">{row.value}</span>
                </div>
              ))}
            </div>

            <Button
              danger={visitor.status !== "Pending"}
              type="primary"
              shape="round"
              className="mt-6 h-10! w-full bg-[#EF4444]! px-5! font-semibold sm:w-auto"
              onClick={() => {
                if (visitor.status === "Pending") {
                  navigate(paths.admin.visitorReview.getHref(visitor.id));
                }
              }}
            >
              {visitor.status === "Pending" ? "Review Visitor" : "Sign Off Visitor"}
            </Button>
          </div>

          <div className="w-full rounded-xl border border-slate-100 bg-white px-4 py-5 shadow-sm shadow-slate-100 sm:px-6 sm:py-6 lg:w-80 lg:shrink-0">
            <h3 className="mb-5 text-base font-bold text-slate-800">Visit Timeline</h3>
            <div className="space-y-0">
              {timeline.map((step, idx) => (
                <div key={step.key} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <TimelineDot status={step.status} />
                    {idx !== timeline.length - 1 && (
                      <span className="my-1 w-px flex-1 bg-slate-100" />
                    )}
                  </div>
                  <div className={idx !== timeline.length - 1 ? "pb-6" : ""}>
                    <p className="text-sm leading-tight font-semibold text-slate-800">
                      {step.title}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">{step.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
