import type { ReactNode } from "react";
import { Info } from "lucide-react";
import { Button, message } from "antd";
import { useCallback, useMemo } from "react";
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

import {
  getVisitorSession,
  type VisitorSession,
} from "../utils/get-visitor-session";

import { useVisitorSocket } from "../hooks/use-visitor-socket";

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
    icon: <LoadingRing />,
  },

  approved: {
    title: "Access approved",
    subtitle: "You're good to go.",
    description:
      "Your visitor request has been approved. Please present this profile page at reception when you arrive.",
    reason: "",
    pillLabel: "Visit Approved",
    pillClasses: "border-emerald-400/60 text-emerald-500",
    icon: <SuccessCheckmark />,
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
    icon: <Info className="h-12 w-12 text-rose-500" />,
    actionLabel: "Register Again",
  },
};

export default function VisitorProfile() {
  const { orgSlug } = useTenant();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  /**
   * Visitor authentication/session is now the source of truth.
   */
  const visitorSession = useMemo<VisitorSession | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    return getVisitorSession();
  }, []);

  /**
   * Optional registration data.
   *
   * This is only used as a UI fallback.
   * It is NOT used for authentication.
   */
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

  const visitorId = visitorSession?.visitorId;
  const token = visitorSession?.accessToken;

  // the visit belonging to the authenticated visitor.
  const visitId =
    visitorSession?.visitId ??
    storedRegistration?.id ??
    undefined;

  const normalizeStatus = useCallback(
    (status?: string | null): VisitorProfileStatus => {
      const normalized = status
        ?.toLowerCase()
        .replace(/[-]/g, " ")
        .trim();

      if (
        normalized === "approved" ||
        normalized === "signed in"
      ) {
        return "approved";
      }

      if (
        normalized === "rejected" ||
        normalized === "declined"
      ) {
        return "rejected";
      }

      return "pending";
    },
    [],
  );

  /**
   * Fetch the visitor's visit.
   *
   * The backend should verify that this visit belongs
   * to the authenticated visitor.
   */
  const {
    data: visitData,
    isLoading: isVisitLoading,
    refetch: refetchVisit,
  } = useGetVisitQuery(visitId ?? "", {
    skip: !visitId,
  });

  /**
   * WebSocket status update.
   *
   * When the admin approves/rejects the visit:
   *
   * Backend:
   *   VisitStatusChangedEvent
   *        ↓
   *   VisitsGateway
   *        ↓
   *   visit.status.changed
   *
   * Frontend:
   *   this callback
   *        ↓
   *   refetch visit
   *        ↓
   *   UI updates
   */
  const handleStatusChanged = useCallback(
    (data: {
      visitId: string;
      status: string;
    }) => {
      if (!visitId || data.visitId !== visitId) {
        return;
      }

      void refetchVisit();
    },
    [visitId, refetchVisit],
  );

  useVisitorSocket({
    visitorId,
    token,
    onStatusChanged: handleStatusChanged,
  });

  const displayedRegistration = useMemo<
    VisitorRegistration | null
  >(() => {
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
          visitData.department ??
          storedRegistration?.department ??
          "",

        phoneNo:
          visitData.phoneNumber ??
          visitData.phone ??
          storedRegistration?.phoneNo ??
          "",

        email:
          visitData.email ??
          storedRegistration?.email ??
          "",

        status: normalizeStatus(
          visitData.status ??
            storedRegistration?.status,
        ),

        requestId:
          visitData.referenceId ??
          visitData.id ??
          storedRegistration?.requestId,

        createdAt:
          visitData.createdAt ??
          storedRegistration?.createdAt,

        badgeNumber:
          visitData.badgeNumber ??
          storedRegistration?.badgeNumber,

        reason:
          visitData.rejectionReason ??
          visitData.reason ??
          storedRegistration?.reason,
      };
    }

    return storedRegistration;
  }, [
    visitData,
    storedRegistration,
    normalizeStatus,
  ]);

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
    registration?.status ??
      searchParams.get("status"),
  );

  const meta = statusMeta[status];

  const isPending = status === "pending";

  const requestId = registration?.requestId
    ? `#${registration.requestId}`
    : "Pending";

  const createdDate = formatDate(
    registration?.createdAt,
  );

  const createdTime = formatTime(
    registration?.createdAt,
  );

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

      message.success(
        "Visit status updated to signed in.",
      );

      await refetchVisit();
    } catch {
      message.error(
        "Unable to complete check-in. Please try again.",
      );
    }
  };

  if (isVisitLoading && !registration) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <LoadingRing />
      </div>
    );
  }

  if (!registration) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <div className="w-full max-w-md text-center">
          <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Visitor registration data could not be loaded.
          </p>

          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Please complete registration again to view
            your visitor request status.
          </p>

          <Button
            type="primary"
            size="large"
            className="mt-6"
            onClick={() =>
              navigate(
                paths.register.getHref(orgSlug),
              )
            }
          >
            Return to registration
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-full w-full justify-center">
      <main className="flex w-full max-w-md flex-1 flex-col items-center px-5 py-8">
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
                {registration.purposeOfVisit ||
                  "Pending"}
              </p>
            </div>
          </div>
        </section>

        {!isPending && meta.actionLabel && (
          <div className="mt-auto w-full pt-8">
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
              {isCheckingIn
                ? "Processing..."
                : meta.actionLabel}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}