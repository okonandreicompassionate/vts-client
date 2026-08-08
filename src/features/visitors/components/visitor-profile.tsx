import type { ReactNode } from "react";
import { Info } from "lucide-react";
import { Button, message } from "antd";
import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import LoadingRing from "../components/loading-ring";
import SuccessCheckmark from "../components/success-checkmark";
import { paths } from "../../../config/paths";
import { useTenant } from "../../../lib/tenant";
import {
  useCheckInVisitMutation,
  useGetVisitQuery,
} from "../api/visit-api-slice";
import type {
  VisitorProfileStatus,
  VisitorRegistration,
} from "../types/visitor-profile";

type StatusMeta = {
  title: string;
  subtitle: string;
  description: string;
  reason: string;
  pillLabel: string;
  pillClasses: string;
  icon: ReactNode;
  actionLabel?: string;
};

const statusMeta: Record<VisitorProfileStatus, StatusMeta> = {
  pending: {
    title: "Waiting for approval",
    subtitle: "Your request is now in review.",
    description:
      "Please wait while the admin reviews your visitor access request. You will be notified when a decision is made.",
    reason: "",
    pillLabel: "Pending Approval",
    pillClasses: "border-[#F5A623]/60 text-[#F5A623]",
    icon: (
      <LoadingRing size={64} className="text-[#F5A623]" />
    ),
  },

  approved: {
    title: "Access approved",
    subtitle: "You're good to go.",
    description:
      "Your visitor request has been approved. Please present this profile page at reception when you arrive.",
    reason: "",
    pillLabel: "Visit Approved",
    pillClasses: "border-emerald-400/60 text-emerald-500",
    icon: <SuccessCheckmark size={64} />,
    actionLabel: "Continue",
  },

  rejected: {
    title: "Request declined",
    subtitle: "Your request was not approved.",
    description:
      "The administrator did not approve this visit. You can resubmit your request with updated details or contact your host for clarification.",
    reason: "",
    pillLabel: "Visit Declined",
    pillClasses: "border-rose-400/60 text-rose-500",
    icon: (
      <img
        src="/rejected.svg"
        alt="Rejected"
        className="h-16 w-16 md:h-20 md:w-20"
      />
    ),
    actionLabel: "Register Again",
  },
};

export default function VisitorProfile() {
  const { orgSlug } = useTenant();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const statusParam =
    searchParams.get("status") as VisitorProfileStatus | null;

  const storedRegistration = useMemo<VisitorRegistration | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const stored = window.localStorage.getItem("visitorRegistration");

    if (!stored) {
      return null;
    }

    try {
      return JSON.parse(stored) as VisitorRegistration;
    } catch {
      return null;
    }
  }, []);

  const normalizeStatus = (
    status?: string | null,
  ): VisitorProfileStatus => {
    const normalized = status
      ?.toLowerCase()
      .replace(/[_-]/g, " ")
      .trim();

    if (normalized === "approved" || normalized === "signed in") {
      return "approved";
    }

    if (normalized === "rejected" || normalized === "declined") {
      return "rejected";
    }

    return "pending";
  };

  const visitId = storedRegistration?.id;

  const { data: visitData } = useGetVisitQuery(visitId ?? "", {
    skip: !visitId,
  });

  const displayedRegistration = useMemo<VisitorRegistration | null>(() => {
    if (visitData) {
      return {
        id: visitData.id ?? storedRegistration?.id,
        name:
          visitData.fullName ??
          visitData.name ??
          storedRegistration?.name ??
          "Visitor",
        purposeOfVisit:
          visitData.purposeOfVisit ??
          visitData.purpose ??
          storedRegistration?.purposeOfVisit ??
          "",
        hostName:
          visitData.hostName ??
          visitData.host ??
          storedRegistration?.hostName ??
          "",
        department:
          visitData.department ?? storedRegistration?.department ?? "",
        phoneNo:
          visitData.phoneNumber ??
          visitData.phone ??
          storedRegistration?.phoneNo ??
          "",
        email: visitData.email ?? storedRegistration?.email ?? "",
        status: normalizeStatus(
          visitData.status ?? storedRegistration?.status,
        ),
        requestId:
          visitData.referenceId ??
          visitData.id ??
          storedRegistration?.requestId,
        createdAt:
          visitData.createdAt ?? storedRegistration?.createdAt,
        badgeNumber:
          visitData.badgeNumber ?? storedRegistration?.badgeNumber,
        reason:
          visitData.rejectionReason ??
          visitData.reason ??
          storedRegistration?.reason,
      };
    }

    return storedRegistration;
  }, [storedRegistration, visitData]);

  const formatDate = (value?: string) => {
    if (!value) {
      return "Pending";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const formatTime = (value?: string) => {
    if (!value) {
      return "Pending";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  const [checkInVisit, { isLoading: isCheckingIn }] =
    useCheckInVisitMutation();

  const registration = displayedRegistration;

  const status = normalizeStatus(
    registration?.status ?? statusParam,
  );

  const meta = statusMeta[status];
  const isPending = status === "pending";

  const requestId = registration?.requestId
    ? `#${registration.requestId}`
    : "Pending";

  const createdDate = formatDate(registration?.createdAt);
  const createdTime = formatTime(registration?.createdAt);
  const reason = registration?.reason;

  const actionPath = (() => {
    switch (status) {
      case "approved":
        return paths.home.getHref(orgSlug);

      case "rejected":
        return paths.register.getHref(orgSlug);

      default:
        return paths.home.getHref(orgSlug);
    }
  })();

  const handleCheckIn = async () => {
    if (!registration?.id) {
      message.error(
        "Unable to check in because the visit ID is missing.",
      );
      return;
    }

    try {
      await checkInVisit(registration.id).unwrap();

      const updatedRegistration: VisitorRegistration = {
        ...registration,
        status: "approved",
      };

      window.localStorage.setItem(
        "visitorRegistration",
        JSON.stringify(updatedRegistration),
      );

      message.success("Visit status updated to signed in.");

      window.location.reload();
    } catch {
      message.error(
        "Unable to complete check-in. Please try again.",
      );
    }
  };

  if (!registration) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-6 text-center text-slate-700 dark:bg-slate-950 dark:text-slate-100">
        <div>
          <p className="text-lg font-semibold">
            Visitor registration data could not be loaded.
          </p>

          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Please complete registration again to view your visitor
            request status.
          </p>

          <Button
            type="primary"
            size="large"
            className="mt-6"
            onClick={() =>
              navigate(paths.register.getHref(orgSlug))
            }
          >
            Return to registration
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white px-6 pt-16 pb-6 text-slate-900 md:px-10 md:pt-20 dark:bg-slate-950 dark:text-slate-100">
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col">
        <div className="flex justify-center">
          {meta.icon}
        </div>

        <div className="flex justify-center">
          <span
            className={`mt-10 inline-flex items-center rounded-full border px-6 py-2 text-[15px] font-semibold md:mt-12 ${meta.pillClasses}`}
          >
            {meta.pillLabel}
          </span>
        </div>

        {status === "rejected" && reason && (
          <div className="mt-8 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <p className="text-xs font-medium text-slate-400">
              Reason for refusal
            </p>

            <div className="mt-2.5 flex items-start gap-2">
              <Info
                className="mt-0.5 h-4 w-4 shrink-0 text-slate-400"
                strokeWidth={2}
              />

              <p className="text-[15px] leading-snug font-semibold text-slate-800 dark:text-slate-100">
                {reason}
              </p>
            </div>
          </div>
        )}

        <section className="mt-8 w-full rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left shadow-sm md:p-6 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-[19px] font-bold text-slate-900 dark:text-slate-100">
            {registration.name}
          </p>

          <p className="mt-1 text-sm text-slate-400">
            ID: {requestId}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-slate-200 pt-4 dark:border-slate-700">
            <div>
              <p className="text-[11px] font-medium tracking-wide text-slate-400 uppercase">
                Host
              </p>

              <p className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">
                {registration.hostName || "Pending"}
              </p>
            </div>

            <div>
              <p className="text-[11px] font-medium tracking-wide text-slate-400 uppercase">
                Department
              </p>

              <p className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">
                {registration.department || "Pending"}
              </p>
            </div>

            <div>
              <p className="text-[11px] font-medium tracking-wide text-slate-400 uppercase">
                Date
              </p>

              <p className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">
                {createdDate}
              </p>
            </div>

            <div>
              <p className="text-[11px] font-medium tracking-wide text-slate-400 uppercase">
                Time
              </p>

              <p className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">
                {createdTime}
              </p>
            </div>

            <div>
              <p className="text-[11px] font-medium tracking-wide text-slate-400 uppercase">
                Phone No
              </p>

              <p className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">
                {registration.phoneNo || "Pending"}
              </p>
            </div>

            <div className="col-span-2">
              <p className="text-[11px] font-medium tracking-wide text-slate-400 uppercase">
                Purpose of Visit
              </p>

              <p className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">
                {registration.purposeOfVisit || "Pending"}
              </p>
            </div>
          </div>
        </section>

        {/* Action button — only for non-pending states */}
        {!isPending && meta.actionLabel && (
          <div className="mt-auto pt-8">
            <Button
              type="primary"
              block
              size="large"
              disabled={isCheckingIn}
              className="h-12! rounded-xl! bg-sky-400! text-[15px]! font-semibold hover:bg-sky-500! disabled:opacity-50!"
              onClick={
                status === "approved"
                  ? handleCheckIn
                  : () => navigate(actionPath)
              }
            >
              {isCheckingIn ? "Processing..." : meta.actionLabel}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}