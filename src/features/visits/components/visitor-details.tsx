import { ArrowLeftOutlined, CheckOutlined } from "@ant-design/icons";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Alert, Button, Input, message } from "antd";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardHeader from "../../../components/layout/dashboard-header.tsx";
import ApproveAccessModal from "./modals/approve-access-modal.tsx";
import RejectVisitorModal from "./modals/reject-visitor-modal.tsx";
import { Avatar } from "../../../components/ui/avatar.tsx";

import { usePopup } from "@/features/popup/hooks/use-popup";

import {
  useApproveVisitMutation,
  useRejectVisitMutation,
  useSignoffVisitMutation,
} from "@/features/visits/api/admins-visit-api-slice.ts";

import { useVisitorDetails } from "../hooks/use-visitor-details.ts";
import { Spinner } from "@/components/ui/spinner.tsx";

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

interface VisitorDetailsProps {
  visitorId?: string;
  onClose?: () => void;
}

export default function VisitorDetails({ visitorId, onClose }: VisitorDetailsProps = {}) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { openModal, closeModal } = usePopup();

  const [notes, setNotes] = useState("");

  const [signoffVisit, { isLoading: isSigningOff }] = useSignoffVisitMutation();

  const [approveVisit, { isLoading: isApproving }] = useApproveVisitMutation();

  const [rejectVisit, { isLoading: isRejecting }] = useRejectVisitMutation();

  const detailId = visitorId ?? id;
  const isDrawer = Boolean(visitorId);
  const { visitor, isLoading, isError, error } = useVisitorDetails(detailId);

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

    openModal(
      <ApproveAccessModal
        visitorName={visitor.name}
        purpose={visitor.purpose}
        hostName={visitor.host}
        onConfirm={handleConfirmApprove}
      />,
    );
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
      await rejectVisit({
        id: visitor.id,
        reason: notes,
      }).unwrap();

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
      className="mb-1px-0! font-medium text-sky-500!"
      onClick={onClose ?? (() => navigate(-1))}
    >
      Back to List
    </Button>
  );

  if (!detailId) {
    return (
      <>
        {!isDrawer && <DashboardHeader title="Visitor Details" />}

        <main className={isDrawer ? "p-4" : "flex-1 px-2 pt-1 pb-3 sm:px-2 md:px-2 md:py-3"}>
          <Alert type="error" showIcon title="No visitor ID was provided." />
        </main>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        {!isDrawer && <DashboardHeader title="Visitor Details" />}

        <main
          className={
            isDrawer
              ? "flex min-h-60 items-center justify-center p-4"
              : "flex flex-1 px-2 pt-1 pb-3 sm:px-2 md:px-2 md:py-3"
          }
        >
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
          {!isDrawer && <DashboardHeader title="Visitor Details" />}

          <main className={isDrawer ? "p-4" : "flex-1 px-2 pt-1 pb-3 sm:px-2 md:px-2 md:py-3"}>
            {!isDrawer && BackButton}

            <Alert
              type="warning"
              showIcon
              title="Visitor not found"
              description="This visitor may have been removed, or the link is incorrect."
            />
          </main>
        </>
      );
    }

    if (status === 401 || status === 403) {
      return (
        <>
          {!isDrawer && <DashboardHeader title="Visitor Details" />}

          <main className={isDrawer ? "p-4" : "flex-1 px-2 pt-1 pb-3 sm:px-2 md:px-2 md:py-3"}>
            <Alert
              type="error"
              showIcon
              title="You're not authorized to view this visitor."
              description="Please sign in again or contact an administrator."
            />
          </main>
        </>
      );
    }

    return (
      <>
        {!isDrawer && <DashboardHeader title="Visitor Details" />}

        <main className={isDrawer ? "p-4" : "flex-1 px-2 pt-1 pb-3 sm:px-2 md:px-2 md:py-3"}>
          {!isDrawer && BackButton}

          <Alert
            type="error"
            showIcon
            title="Something went wrong loading this visitor."
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
    return (
      <>
        {!isDrawer && <DashboardHeader title="Visitor Details" />}

        <main className={isDrawer ? "p-4" : "flex-1 px-2 pt-1 pb-3 sm:px-2 md:px-2 md:py-3"}>
          {!isDrawer && BackButton}

          <Alert type="warning" showIcon title="Visitor not found" />
        </main>
      </>
    );
  }

  const isRejected = visitor.status === "Rejected";

  const timeline: TimelineStep[] = [
    {
      key: "1",
      title: "Registration received",
      time: isRejected ? "" : visitor.time,
      status: "done-blue",
    },
    {
      key: "2",
      title: isRejected
        ? "Approval rejected"
        : visitor.status === "Pending"
          ? "Awaiting approval"
          : "Approved for entry",
      time: isRejected ? "" : visitor.status === "Pending" ? "Pending review" : visitor.checkIn,
      status: isRejected
        ? "done-orange"
        : visitor.status === "Signed In" || visitor.status === "Signed Off"
          ? "done-green"
          : "done-orange",
    },
    {
      key: "3",
      title: isRejected
        ? "Visit rejected"
        : visitor.status === "Signed Off"
          ? "Signed out"
          : visitor.status === "Signed In"
            ? "Currently signed in"
            : "Pending confirmation",
      time: isRejected
        ? ""
        : visitor.status === "Signed Off"
          ? visitor.time
          : visitor.status === "Signed In"
            ? visitor.checkIn
            : "Pending",
      status: isRejected
        ? "done-orange"
        : visitor.status === "Signed Off" || visitor.status === "Signed In"
          ? "done-green"
          : "done-orange",
    },
  ];

  const detailRows: { label: string; value: string }[] = [
    { label: "Full Name", value: visitor.name },
    { label: "Email Address", value: visitor.email },
    { label: "Phone Number", value: visitor.phone },
    { label: "Host Name", value: visitor.host },
    { label: "Purpose of Visit", value: visitor.purpose },
    ...(isRejected
      ? []
      : [
          { label: "Signed-In Time", value: visitor.checkIn },
          {
            label: "Signed-Out Time",
            value: visitor.status === "Signed Off" ? visitor.time : "Pending",
          },
        ]),
  ];

  // ---------- Drawer layout (fixed-width panel — compact, never relies on viewport breakpoints) ----------
  if (isDrawer) {
    const showSignOff = visitor.status === "Signed In";
    const showReview = visitor.status === "Pending";
    const hasFooterActions = showSignOff || showReview;

    return (
      <div className="flex h-full min-h-0 flex-col bg-white dark:bg-slate-800">
        {/* Scrollable content */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="flex flex-col items-center border-b border-slate-100 px-4 pt-4 pb-3 text-center dark:border-slate-700">
            <Avatar name={visitor.name} size="sm" />

            <h3 className="mt-2 text-sm font-bold text-slate-900 dark:text-slate-100">
              {visitor.name}
            </h3>

            <span
              className={`mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] ${statusStyles[visitor.status]}`}
            >
              {visitor.status}
            </span>
          </div>

          <div className="px-4 py-3">
            <div className="overflow-hidden rounded-lg border border-slate-100 dark:border-slate-700">
              {detailRows.map((row, idx) => (
                <div
                  key={row.label}
                  className={`flex items-start gap-3 px-3 py-2 ${
                    idx !== detailRows.length - 1
                      ? "border-b border-slate-100 dark:border-slate-700"
                      : ""
                  }`}
                >
                  <span className="w-28 shrink-0 text-[10px] text-slate-500 dark:text-slate-400">
                    {row.label}
                  </span>
                  <span className="min-w-0 flex-1 text-xs wrap-break-word text-slate-800 dark:text-slate-100">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            <h4 className="mt-4 mb-2 text-xs font-bold text-slate-900 dark:text-slate-100">
              Visit Timeline
            </h4>

            <div>
              {timeline.map((step, idx) => (
                <div key={step.key} className="flex gap-1.5">
                  <div className="flex flex-col items-center">
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] text-white ${dotStyles[step.status]}`}
                    >
                      <CheckOutlined />
                    </span>

                    {idx !== timeline.length - 1 && (
                      <span className="w-px flex-1 bg-slate-100 dark:bg-slate-700" />
                    )}
                  </div>

                  <div className={idx !== timeline.length - 1 ? "pb-3" : ""}>
                    <p className="text-[11px] leading-tight font-semibold text-slate-900 dark:text-slate-100">
                      {step.title}
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                      {step.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {showReview && (
              <div className="mt-3 rounded-lg border border-slate-200 bg-slate-100 p-3 dark:border-slate-700 dark:bg-slate-900">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Review and Approve
                </h4>

                <p className="mt-1 mb-2 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                  Verify the visitor information before granting access and optionally add internal
                  notes.
                </p>

                <label className="mb-1.5 block text-[11px] font-semibold text-slate-800 dark:text-slate-100">
                  Notes (Optional)
                </label>

                <TextArea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter notes here.."
                  rows={3}
                  className="rounded-lg text-xs"
                />
              </div>
            )}
          </div>
        </div>

        {/* Sticky footer actions — always reachable regardless of content height */}
        {hasFooterActions && (
          <div className="shrink-0 border-t border-slate-200 bg-white px-4 py-2.5 dark:border-slate-700 dark:bg-slate-800">
            {showSignOff && (
              <Button
                danger
                type="primary"
                shape="round"
                loading={isSigningOff}
                block
                size="middle"
                className="rounded-sm! bg-[#EF4444]! font-semibold"
                onClick={handleSignOff}
              >
                Sign Off Visitor
              </Button>
            )}

            {showReview && (
              <div className="flex gap-1.5">
                <Button
                  danger
                  loading={isRejecting}
                  disabled={isApproving || isRejecting}
                  onClick={handleReject}
                  block
                  className="font-medium"
                >
                  Reject
                </Button>

                <Button
                  type="primary"
                  loading={isApproving}
                  disabled={isApproving || isRejecting}
                  onClick={handleApprove}
                  block
                  className="bg-emerald-500! font-semibold hover:bg-emerald-600!"
                >
                  Approve
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // ---------- Full page layout (unchanged) ----------
  return (
    <>
      <DashboardHeader title="Visitor Details" />

      <main className="flex-1 px-2 pt-1 pb-3 sm:px-2 md:px-2 md:py-3">
        {BackButton}

        <div className="w-full xl:flex xl:min-h-[calc(100vh-3.25rem)] xl:justify-center">
          <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:gap-6 xl:h-full xl:w-full xl:gap-8 2xl:gap-10">
            <div className="w-full min-w-0 rounded-xl border border-slate-100 bg-white px-4 py-6 shadow-sm shadow-slate-100 sm:px-6 md:px-8 md:py-8 lg:flex-1 xl:h-full xl:px-10 xl:py-8 2xl:px-12 2xl:py-10 dark:border-slate-800 dark:bg-slate-800 dark:shadow-none">
              <div className="mb-6 flex flex-col items-center text-center">
                <div className="mb-2.5">
                  <Avatar name={visitor.name} size="md" />
                </div>

                <h3 className="text-md font-bold text-slate-800 xl:text-lg dark:text-slate-100">
                  {visitor.name}
                </h3>

                <span
                  className={`mt-1 inline-flex items-center rounded-full px-3 py-0.5 text-xs ${statusStyles[visitor.status]}`}
                >
                  {visitor.status}
                </span>
              </div>

              <div className="overflow-hidden rounded-lg border border-slate-100 dark:border-slate-700">
                {detailRows.map((row, idx) => (
                  <div
                    key={row.label}
                    className={`grid min-w-0 grid-cols-1 gap-1 px-4 py-2.5 sm:grid-cols-[11rem_minmax(0,1fr)] sm:items-center sm:gap-x-5 sm:ps-6 sm:pe-5 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-x-6 md:ps-8 md:pe-6 xl:grid-cols-[13rem_minmax(0,1fr)] xl:gap-x-8 xl:py-3 xl:ps-10 xl:pe-8 ${
                      idx !== detailRows.length - 1
                        ? "border-b border-slate-100 dark:border-slate-700"
                        : ""
                    }`}
                  >
                    <span className="text-xs text-slate-400">{row.label}</span>

                    <span className="min-w-0 text-xs wrap-break-word text-slate-700 dark:text-slate-200">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              {visitor.status === "Signed In" ? (
                <Button
                  danger
                  type="primary"
                  shape="round"
                  loading={isSigningOff}
                  className="mt-6 h-7! w-full rounded-sm! bg-[#EF4444]! px-5! font-semibold sm:w-auto"
                  onClick={handleSignOff}
                >
                  Sign Off Visitor
                </Button>
              ) : null}
            </div>

            <div className="w-full min-w-0 rounded-lg border border-slate-100 bg-white px-4 py-4 shadow-sm shadow-slate-100 sm:px-6 sm:py-6 lg:w-84 lg:shrink-0 xl:w-[24rem] xl:px-7 xl:py-6 2xl:w-104 dark:border-slate-800 dark:bg-slate-800 dark:shadow-none">
              <h3 className="mb-2.5 text-sm font-bold text-slate-800 dark:text-slate-100">
                Visit Timeline
              </h3>

              <div>
                {timeline.map((step, idx) => (
                  <div key={step.key} className="flex gap-2">
                    <div className="flex flex-col items-center">
                      <TimelineDot status={step.status} />

                      {idx !== timeline.length - 1 && (
                        <span className="w-px flex-1 bg-slate-100 dark:bg-slate-700" />
                      )}
                    </div>

                    <div className={idx !== timeline.length - 1 ? "pb-4" : ""}>
                      <p className="text-xs leading-tight font-semibold text-slate-800 dark:text-slate-100">
                        {step.title}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-400">{step.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              {visitor.status === "Pending" ? (
                <div className="mt-3 rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    Review and Approve
                  </h4>

                  <p className="mb-2 text-xs leading-relaxed text-slate-400">
                    Verify the visitor information before granting access and optionally add
                    internal notes.
                  </p>

                  <label className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-200">
                    Notes (Optional)
                  </label>

                  <TextArea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter notes here.."
                    rows={4}
                    className="mb-3 rounded-lg"
                  />

                  <div className="flex gap-1.5 sm:flex-row sm:gap-2.5">
                    <Button
                      danger
                      loading={isRejecting}
                      disabled={isApproving || isRejecting}
                      onClick={handleReject}
                      className="h-9! w-full px-4 font-medium sm:w-auto"
                    >
                      Reject
                    </Button>

                    <Button
                      type="primary"
                      loading={isApproving}
                      disabled={isApproving || isRejecting}
                      onClick={handleApprove}
                      className="h-9! w-full bg-emerald-500! px-2 font-semibold hover:bg-emerald-600! sm:w-auto"
                    >
                      Approve Access
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}