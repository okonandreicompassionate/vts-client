import { ArrowLeftOutlined, CheckOutlined } from "@ant-design/icons";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Alert, Button, Input } from "antd";
import { useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { PageShell } from "@/components/page";
import { useAdminAuthSession } from "@/features/auth/hooks/use-auth-session";
import { checkInRoles, checkOutRoles, hasRole } from "@/types/user-role";
import RejectAppointmentModal from "./modals/reject-appointment-modal";
import { Avatar } from "../../../components/ui/avatar.tsx";

import { usePopup } from "@/lib/contexts/popup/use-popup";

import { useVisitorCheckActions } from "../hooks/use-visitor-check-actions";

import { useVisitorDetails } from "../hooks/use-visitor-details.ts";
import { formatVisitTime } from "../utils/visits.ts";
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
  const { openModal } = usePopup();
  const { data: currentUser } = useAdminAuthSession();
  const canCheckIn = hasRole(currentUser?.role, checkInRoles);
  const canCheckOut = hasRole(currentUser?.role, checkOutRoles);

  const [notes, setNotes] = useState("");

  const {
    confirmApprove,
    confirmCheckIn,
    confirmCheckOut,
    isApproving,
    isCheckingIn,
    isCheckingOut,
  } = useVisitorCheckActions();

  const detailId = visitorId ?? id;
  const isDrawer = Boolean(visitorId);
  const { visitor, isLoading, isError, error } = useVisitorDetails(detailId);

  const statusStyles: Record<string, string> = {
    Approved:
      "bg-sky-50 text-sky-600 border border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800",
    "Signed In":
      "bg-emerald-50 text-emerald-500 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800",

    Pending:
      "bg-orange-50 text-orange-400 border border-orange-200 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-800",

    "Signed Off":
      "bg-slate-100 text-slate-500 border border-slate-200 dark:bg-zinc-700 dark:text-zinc-300 dark:border-zinc-600",

    Rejected:
      "bg-rose-50 text-rose-500 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800",
  };

  // Both ask for confirmation first, like everywhere else.
  const handleCheckIn = () => {
    if (visitor) confirmCheckIn(visitor);
  };

  const handleCheckOut = () => {
    if (visitor) confirmCheckOut(visitor);
  };

  // The same approve confirmation and reject modal as every other list.
  const handleApprove = () => {
    if (visitor) confirmApprove(visitor);
  };

  const handleReject = () => {
    if (!visitor) return;

    openModal(
      <RejectAppointmentModal
        appointment={visitor}
        initialReason={notes}
        onRejected={() => setNotes("")}
      />,
    );
  };

  const BackButton = (
    <Button
      type="link"
      icon={<ArrowLeftOutlined className="text-xs" />}
      className="mb-1 px-0! font-medium text-sky-500!"
      onClick={onClose ?? (() => navigate(-1))}
    >
      Back to List
    </Button>
  );

  // Drawer: bare padded content. Full page: the shared page layout with Back as the action.
  const renderFrame = (
    content: ReactNode,
    { title = "Visitor details", centered = false }: { title?: string; centered?: boolean } = {},
  ) =>
    isDrawer ? (
      <main className={centered ? "flex min-h-60 items-center justify-center p-4" : "p-4"}>
        {content}
      </main>
    ) : (
      <PageShell title={title} actions={BackButton}>
        {content}
      </PageShell>
    );

  if (!detailId) {
    return renderFrame(<Alert type="error" showIcon title="No visitor ID was provided." />);
  }

  if (isLoading) {
    return renderFrame(<Spinner variant="page" label="Loading visitor..." />, { centered: true });
  }

  if (isError) {
    const status = getErrorStatus(error);

    if (status === 404) {
      return renderFrame(
        <Alert
          type="warning"
          showIcon
          title="Visitor not found"
          description="This visitor may have been removed, or the link is incorrect."
        />,
      );
    }

    if (status === 401 || status === 403) {
      return renderFrame(
        <Alert
          type="error"
          showIcon
          title="You're not authorized to view this visitor."
          description="Please sign in again or contact an administrator."
        />,
      );
    }

    return renderFrame(
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
      />,
    );
  }

  if (!visitor) {
    return renderFrame(<Alert type="warning" showIcon title="Visitor not found" />);
  }

  const isRejected = visitor.status === "Rejected";
  const isApproved = visitor.status === "Approved";
  const isCheckedIn = visitor.status === "Signed In";

  const timeline: TimelineStep[] = isRejected
    ? [
        {
          key: "1",
          title: "Registration received",
          time: visitor.time,
          status: "done-blue",
        },
        {
          key: "2",
          title: "Visit rejected",
          time: formatVisitTime(visitor.reviewedAt),
          status: "done-orange",
        },
      ]
    : [
        {
          key: "1",
          title: "Registration received",
          time: visitor.time,
          status: "done-blue",
        },
        {
          key: "2",
          title: visitor.status === "Pending" ? "Awaiting approval" : "Approved for entry",
          time:
            visitor.status === "Pending"
              ? "Pending review"
              : isApproved
                ? formatVisitTime(visitor.reviewedAt)
                : visitor.checkIn,
          status:
            isApproved || isCheckedIn || visitor.status === "Signed Off"
              ? "done-green"
              : "done-orange",
        },
        {
          key: "3",
          title:
            visitor.status === "Signed Off"
              ? "Signed out"
              : isCheckedIn
                ? "Currently signed in"
                : isApproved
                  ? "Awaiting visitor check-in"
                  : "Pending confirmation",
          time:
            visitor.status === "Signed Off"
              ? visitor.checkOut
              : isCheckedIn
                ? visitor.checkIn
                : "Pending",
          status: visitor.status === "Signed Off" || isCheckedIn ? "done-green" : "done-orange",
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
          {
            label: "Signed-In Time",
            value: visitor.checkIn,
          },
          {
            label: "Signed-Out Time",
            value: visitor.status === "Signed Off" ? visitor.checkOut : "Pending",
          },
        ]),
  ];

  // In a drawer the visit's actions are in the drawer's header menu (VisitorDetailsDrawer).
  if (isDrawer) {
    return (
      <div className="flex h-full min-h-0 flex-col bg-white dark:bg-zinc-800">
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="flex flex-col items-center border-b border-slate-100 px-4 pt-4 pb-3 text-center dark:border-zinc-700">
            <Avatar name={visitor.name} size="sm" />

            <h3 className="mt-2 text-sm font-bold text-slate-900 dark:text-zinc-100">
              {visitor.name}
            </h3>

            <span
              className={`mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] ${statusStyles[visitor.status]}`}
            >
              {visitor.status}
            </span>
          </div>

          <div className="px-4 py-3">
            <div className="overflow-hidden rounded-lg border border-slate-100 dark:border-zinc-700">
              {detailRows.map((row, idx) => (
                <div
                  key={row.label}
                  className={`flex items-start gap-3 px-3 py-2 ${
                    idx !== detailRows.length - 1
                      ? "border-b border-slate-100 dark:border-zinc-700"
                      : ""
                  }`}
                >
                  <span className="w-28 shrink-0 text-[10px] text-slate-500 dark:text-zinc-400">
                    {row.label}
                  </span>
                  <span className="min-w-0 flex-1 text-xs wrap-break-word text-slate-800 dark:text-zinc-100">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            <h4 className="mt-4 mb-2 text-xs font-bold text-slate-900 dark:text-zinc-100">
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
                      <span className="w-px flex-1 bg-slate-100 dark:bg-zinc-700" />
                    )}
                  </div>

                  <div className={idx !== timeline.length - 1 ? "pb-3" : ""}>
                    <p className="text-[11px] leading-tight font-semibold text-slate-900 dark:text-zinc-100">
                      {step.title}
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-500 dark:text-zinc-400">
                      {step.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------- Full page layout ----------
  return (
    <PageShell title={visitor.name} actions={BackButton}>
      <div className="w-full xl:flex xl:min-h-[calc(100vh-3.25rem)] xl:justify-center">
        <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:gap-6 xl:h-full xl:w-full xl:gap-8 2xl:gap-10">
          <div className="w-full min-w-0 rounded-xl border border-slate-200 bg-white px-4 py-6 sm:px-6 md:px-8 md:py-8 lg:flex-1 xl:h-full xl:px-10 xl:py-8 2xl:px-12 2xl:py-10 dark:border-zinc-700 dark:bg-zinc-800">
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="mb-2.5">
                <Avatar name={visitor.name} size="md" />
              </div>

              <h3 className="text-md font-bold text-slate-800 xl:text-lg dark:text-zinc-100">
                {visitor.name}
              </h3>

              <span
                className={`mt-1 inline-flex items-center rounded-full px-3 py-0.5 text-xs ${statusStyles[visitor.status]}`}
              >
                {visitor.status}
              </span>
            </div>

            <div className="overflow-hidden rounded-lg border border-slate-100 dark:border-zinc-700">
              {detailRows.map((row, idx) => (
                <div
                  key={row.label}
                  className={`grid min-w-0 grid-cols-1 gap-1 px-4 py-2.5 sm:grid-cols-[11rem_minmax(0,1fr)] sm:items-center sm:gap-x-5 sm:ps-6 sm:pe-5 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-x-6 md:ps-8 md:pe-6 xl:grid-cols-[13rem_minmax(0,1fr)] xl:gap-x-8 xl:py-3 xl:ps-10 xl:pe-8 ${
                    idx !== detailRows.length - 1
                      ? "border-b border-slate-100 dark:border-zinc-700"
                      : ""
                  }`}
                >
                  <span className="text-xs text-slate-400">{row.label}</span>

                  <span className="min-w-0 text-xs wrap-break-word text-slate-700 dark:text-zinc-200">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            {isApproved && canCheckIn ? (
              <Button
                color="green"
                variant="solid"
                loading={isCheckingIn}
                className="mt-6 w-full sm:w-auto"
                onClick={handleCheckIn}
              >
                Check In Visitor
              </Button>
            ) : isCheckedIn && canCheckOut ? (
              <Button
                danger
                type="primary"
                loading={isCheckingOut}
                className="mt-6 w-full sm:w-auto"
                onClick={handleCheckOut}
              >
                Check Out Visitor
              </Button>
            ) : null}
          </div>

          <div className="w-full min-w-0 rounded-lg border border-slate-200 bg-white px-4 py-4 sm:px-6 sm:py-6 lg:w-84 lg:shrink-0 xl:w-[24rem] xl:px-7 xl:py-6 2xl:w-104 dark:border-zinc-700 dark:bg-zinc-800">
            <h3 className="mb-2.5 text-sm font-bold text-slate-800 dark:text-zinc-100">
              Visit Timeline
            </h3>

            <div>
              {timeline.map((step, idx) => (
                <div key={step.key} className="flex gap-2">
                  <div className="flex flex-col items-center">
                    <TimelineDot status={step.status} />

                    {idx !== timeline.length - 1 && (
                      <span className="w-px flex-1 bg-slate-100 dark:bg-zinc-700" />
                    )}
                  </div>

                  <div className={idx !== timeline.length - 1 ? "pb-4" : ""}>
                    <p className="text-xs leading-tight font-semibold text-slate-800 dark:text-zinc-100">
                      {step.title}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-400">{step.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {visitor.status === "Pending" ? (
              <div className="mt-3 rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-zinc-700 dark:bg-zinc-900">
                <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-100">
                  Review and Approve
                </h4>

                <p className="mb-2 text-xs leading-relaxed text-slate-400">
                  Verify the visitor information before granting access and optionally add internal
                  notes.
                </p>

                <label className="mb-2 block text-xs font-semibold text-slate-700 dark:text-zinc-200">
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
                    disabled={isApproving}
                    onClick={handleReject}
                    className="w-full sm:w-auto"
                  >
                    Reject
                  </Button>

                  <Button
                    color="green"
                    variant="solid"
                    loading={isApproving}
                    disabled={isApproving}
                    onClick={handleApprove}
                    className="w-full sm:w-auto"
                  >
                    Approve Access
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
