import { ArrowLeftOutlined, CheckOutlined } from "@ant-design/icons";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Alert, Button, Input, message } from "antd";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/layout/Header.tsx";
import ApproveAccessModal from "./modals/approve-access-modal.tsx";
import RejectVisitorModal from "./modals/reject-visitor-modal.tsx";
import { VisitorAvatar } from "./visitor-avatar.tsx";
import { paths } from "../../../config/paths";
import { usePopup } from "../../../hooks/use-popup.tsx";
import {
  useApproveVisitMutation,
  useRejectVisitMutation,
  useSignoffVisitMutation,
} from "../api/admin-api-slice.ts";
import { useTenant } from "../../../lib/tenant/tenant";
import { useVisitorDetails } from "../hooks/use-visitor-details.ts";
import { Spinner } from "@/components/spinner.tsx";

const { TextArea } = Input;

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

function getErrorStatus(error: unknown): number | string | undefined {
  if (error && typeof error === "object" && "status" in error) {
    return (error as FetchBaseQueryError).status;
  }
  return undefined;
}

export default function VisitorDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { orgSlug } = useTenant();
  const { openModal, closeModal } = usePopup();
  const [notes, setNotes] = useState("");

  const [signoffVisit, { isLoading: isSigningOff }] = useSignoffVisitMutation();
  const [approveVisit, { isLoading: isApproving }] = useApproveVisitMutation();
  const [rejectVisit, { isLoading: isRejecting }] = useRejectVisitMutation();

  const { visitor, isLoading, isError, error } = useVisitorDetails(id);

  const statusStyles: Record<string, string> = {
    "Signed In":
      "bg-emerald-50 text-emerald-500 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800",
    Pending:
      "bg-orange-50 text-orange-400 border border-orange-200 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-800",
    "Signed Off":
      "bg-slate-100 text-slate-500 border border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600",
    Rejected:
      "bg-rose-50 text-rose-500 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800",
  };

  const handleSignOff = async () => {
    if (!visitor?.id) return;
    try {
      await signoffVisit(visitor.id).unwrap();
      message.success("Visitor signed off successfully.");
    } catch {
      message.error("Sign off could not be completed. Please try again.");
    }
  };

  const handleApprove = () => {
    if (!visitor) return;
    openModal(<ApproveAccessModal visitorName={visitor.name} onConfirm={handleConfirmApprove} />);
  };

  const handleConfirmApprove = async () => {
    if (!visitor?.id) return;
    try {
      await approveVisit(visitor.id).unwrap();
      message.success("Visitor approved successfully.");
      closeModal();
    } catch {
      message.error("Approval could not be completed. Please try again.");
    }
  };

  const handleReject = () => {
    openModal(<RejectVisitorModal onConfirm={handleConfirmReject} />);
  };

  const handleConfirmReject = async () => {
    if (!visitor?.id) return;
    try {
      await rejectVisit({ id: visitor.id, reason: notes }).unwrap();
      message.success("Visitor rejected.");
      setNotes("");
      closeModal();
    } catch {
      message.error("Rejection could not be completed. Please try again.");
    }
  };

  const BackButton = (
    <Button
      type="link"
      icon={<ArrowLeftOutlined className="text-xs" />}
      className="mb-4 px-0! font-medium text-sky-500!"
      onClick={() => navigate(paths.admin.visitors.getHref(orgSlug))}
    >
      Back to List
    </Button>
  );

  if (!id) {
    return (
      <>
        <Header title="Visitor Details" />
        <main className="flex-1 px-3 pt-2.5 pb-3 sm:px-4 md:px-8 md:py-6">
          <Alert type="error" showIcon message="No visitor ID was provided." />
        </main>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <Header title="Visitor Details" />
        <main className="flex flex-1 px-3 py-16">
          <Spinner variant="page" label="Loading visitor..." />
        </main>
      </>
    );
  }

  if (isError) {
    const status = getErrorStatus(error);

    if (status === 404) {
      return (
        <>
          <Header title="Visitor Details" />
          <main className="flex-1 px-3 pt-2.5 pb-3 sm:px-4 md:px-8 md:py-6">
            {BackButton}
            <Alert
              type="warning"
              showIcon
              message="Visitor not found"
              description="This visitor may have been removed, or the link is incorrect."
            />
          </main>
        </>
      );
    }

    if (status === 401 || status === 403) {
      return (
        <>
          <Header title="Visitor Details" />
          <main className="flex-1 px-3 pt-2.5 pb-3 sm:px-4 md:px-8 md:py-6">
            <Alert
              type="error"
              showIcon
              message="You're not authorized to view this visitor."
              description="Please sign in again or contact an administrator."
            />
          </main>
        </>
      );
    }

    return (
      <>
        <Header title="Visitor Details" />
        <main className="flex-1 px-3 pt-2.5 pb-3 sm:px-4 md:px-8 md:py-6">
          {BackButton}
          <Alert
            type="error"
            showIcon
            message="Something went wrong loading this visitor."
            description="Please try again."
            action={
              <Button size="small" onClick={() => window.location.reload()}>
                Retry
              </Button>
            }
          />
        </main>
      </>
    );
  }

  if (!visitor) {
    // Defensive fallback — shouldn't happen once isLoading/isError are handled,
    // but keeps the render exhaustive for TypeScript.
    return (
      <>
        <Header title="Visitor Details" />
        <main className="flex-1 px-3 pt-2.5 pb-3 sm:px-4 md:px-8 md:py-6">
          {BackButton}
          <Alert type="warning" showIcon message="Visitor not found" />
        </main>
      </>
    );
  }

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
        {BackButton}

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <div className="w-full rounded-xl border border-slate-100 bg-white px-4 py-5 shadow-sm shadow-slate-100 sm:px-6 sm:py-6 md:px-8 md:py-8 lg:flex-1 dark:border-slate-800 dark:bg-slate-800 dark:shadow-none">
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="mb-4">
                <VisitorAvatar name={visitor.name} size="lg" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                {visitor.name}
              </h3>
              <span
                className={`mt-2 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusStyles[visitor.status]}`}
              >
                {visitor.status}
              </span>
            </div>

            <div className="overflow-hidden rounded-lg border border-slate-100 dark:border-slate-700">
              {detailRows.map((row, idx) => (
                <div
                  key={row.label}
                  className={`flex flex-col gap-1 px-4 py-3.5 sm:flex-row sm:items-center sm:px-5 ${idx !== detailRows.length - 1 ? "border-b border-slate-100 dark:border-slate-700" : ""}`}
                >
                  <span className="w-full shrink-0 text-sm text-slate-400 sm:w-40">
                    {row.label}
                  </span>
                  <span className="text-sm text-slate-700 dark:text-slate-200">{row.value}</span>
                </div>
              ))}
            </div>

            {visitor.status === "Pending" ? (
              <div className="mt-6 border-t border-slate-100 pt-6 dark:border-slate-700">
                <h4 className="mb-2 text-base font-bold text-slate-800 dark:text-slate-100">
                  Review and Approve
                </h4>
                <p className="mb-4 text-sm leading-relaxed text-slate-400">
                  Please verify the visitor information before granting access. You can add internal
                  notes below for audit purposes.
                </p>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Notes (Optional)
                </label>
                <TextArea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter notes here.."
                  rows={4}
                  className="mb-5 rounded-lg"
                />

                <div className="flex justify-start gap-3">
                  <Button
                    danger
                    loading={isRejecting}
                    disabled={isApproving || isRejecting}
                    onClick={handleReject}
                    className="h-11! px-8 font-semibold"
                  >
                    Reject
                  </Button>
                  <Button
                    type="primary"
                    loading={isApproving}
                    disabled={isApproving || isRejecting}
                    onClick={handleApprove}
                    className="h-11! bg-emerald-500! px-8 font-semibold hover:bg-emerald-600!"
                  >
                    Approve Access
                  </Button>
                </div>
              </div>
            ) : visitor.status === "Signed In" ? (
              <Button
                danger
                type="primary"
                shape="round"
                loading={isSigningOff}
                className="mt-6 h-10! w-full bg-[#EF4444]! px-5! font-semibold sm:w-auto"
                onClick={handleSignOff}
              >
                Sign Off Visitor
              </Button>
            ) : null}
          </div>

          <div className="w-full rounded-xl border border-slate-100 bg-white px-4 py-5 shadow-sm shadow-slate-100 sm:px-6 sm:py-6 lg:w-80 lg:shrink-0 dark:border-slate-800 dark:bg-slate-800 dark:shadow-none">
            <h3 className="mb-5 text-base font-bold text-slate-800 dark:text-slate-100">
              Visit Timeline
            </h3>
            <div className="space-y-0">
              {timeline.map((step, idx) => (
                <div key={step.key} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <TimelineDot status={step.status} />
                    {idx !== timeline.length - 1 && (
                      <span className="my-1 w-px flex-1 bg-slate-100 dark:bg-slate-700" />
                    )}
                  </div>
                  <div className={idx !== timeline.length - 1 ? "pb-6" : ""}>
                    <p className="text-sm leading-tight font-semibold text-slate-800 dark:text-slate-100">
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
