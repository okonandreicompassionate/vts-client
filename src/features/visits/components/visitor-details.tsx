import { ArrowLeftOutlined, CheckOutlined } from "@ant-design/icons";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Alert, Button, Input, message } from "antd";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardHeader from "../../../app/routes/admin/layout/dashboard-header.tsx";
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

export default function VisitorDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
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
      onClick={() => navigate(-1)}
    >
      Back to List
    </Button>
  );

  if (!id) {
    return (
      <>
        <DashboardHeader title="Visitor Details" />

        <main className="flex-1 px-3 pt-2.5 pb-3 sm:px-4 md:px-8 md:py-6">
          <Alert type="error" showIcon title="No visitor ID was provided." />
        </main>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <DashboardHeader title="Visitor Details" />

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
          <DashboardHeader title="Visitor Details" />

          <main className="flex-1 px-3 pt-2.5 pb-3 sm:px-4 md:px-8 md:py-6">
            {BackButton}

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
          <DashboardHeader title="Visitor Details" />

          <main className="flex-1 px-2 pt-1 pb-3 sm:px-4 md:px-5 md:py-3">
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
        <DashboardHeader title="Visitor Details" />

        <main className="flex-1 px-3 pt-2.5 pb-3 sm:px-4 md:px-8 md:py-6">
          {BackButton}

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
        <DashboardHeader title="Visitor Details" />

        <main className="flex-1 px-3 pt-2.5 pb-3 sm:px-4 md:px-8 md:py-6">
          {BackButton}

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
    {
      label: "Full Name",
      value: visitor.name,
    },
    {
      label: "Email Address",
      value: visitor.email,
    },
    {
      label: "Phone Number",
      value: visitor.phone,
    },
    {
      label: "Host Name",
      value: visitor.host,
    },
    {
      label: "Purpose of Visit",
      value: visitor.purpose,
    },
    {
      label: "Signed-In Time",
      value: visitor.checkIn,
    },
    {
      label: "Signed-Out Time",
      value: visitor.status === "Signed Off" ? visitor.time : "Pending",
    },
  ];

  return (
    <>
      <DashboardHeader title="Visitor Details" />

      <main className="flex-1 px-3 w-full sm:px-4 md:py-2 xl:px-8 2xl:px-20">
        {BackButton}

        <div className="xl:flex w-full xl:min-h-[calc(100vh-3.25rem)] xl:justify-center">
          <div className="flex min-w-0 flex-col gap-1.5 lg:flex-row xl:w-full xl:h-full xl:gap-8 2xl:gap-10">
            <div className="min-w-0 w-full xl:h-full rounded-xl border border-slate-100 bg-white px-4 shadow-sm shadow-slate-100 sm:px-6 py-6 md:px-8 md:py-8 lg:flex-1 dark:border-slate-800 dark:bg-slate-800 dark:shadow-none xl:px-10 xl:py-8 2xl:px-12 2xl:py-10">
              <div className="mb-6 flex flex-col items-center text-center">
                <div className="mb-2.5">
                  <Avatar name={visitor.name} size="md" />
                </div>

                <h3 className="text-md font-bold text-slate-800 dark:text-slate-100 xl:text-lg">
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
                    className={`flex min-w-0 flex-col gap-1 xl:gap-0 xl:ps-10 px-4 py-2.5 sm:flex-row sm:items-center sm:px-5 xl:px-6 xl:py-3 ${
                      idx !== detailRows.length - 1
                        ? "border-b border-slate-100 dark:border-slate-700"
                        : ""
                    }`}
                  >
                    <span className="w-full shrink-0 text-xs text-slate-400 sm:w-40 xl:w-44">
                      {row.label}
                    </span>

                    <span className="min-w-0 wrap-break-word text-xs text-slate-700 dark:text-slate-200">
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

            <div className="min-w-0 w-full rounded-lg border border-slate-100 bg-white px-4 py-3 shadow-sm shadow-slate-100 sm:px-6 sm:py-6 lg:w-80 lg:shrink-0 dark:border-slate-800 dark:bg-slate-800 dark:shadow-none xl:w-96 xl:px-6 xl:py-6 2xl:w-104">
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
                    Verify the visitor information before granting access and optionally add internal
                    notes.
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

                  <div className="flex flex-col gap-3 sm:flex-row">
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