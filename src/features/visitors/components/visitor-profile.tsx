// import type { ReactNode } from "react";
import { Info } from "lucide-react";
import { Button } from "antd";
import { useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import LoadingRing from "../animations/loading-ring";
// import SuccessCheckmark from "../components/success-checkmark";
import { paths } from "../../../config/paths";
import { useTenant } from "../../../lib/tenant";
import { useGetVisitQuery } from "../api/visit-api-slice";
import type { VisitorProfileStatus, VisitorRegistration } from "../types/visitor-profile";
import { useVisitorSocket } from "../hooks/use-visitor-socket";
import { useAppSelector } from "@/lib/stores/hooks";

type StatusMeta = {
  subtitle: string;
  description: string;
  reason: string;
  label: string;
  pillClasses: string;
  actionLabel?: string;
};

const statusMeta: Record<VisitorProfileStatus, StatusMeta> = {
  pending: {
    subtitle: "Your request is now in review.",
    description: "",
    reason: "",
    label: "Pending",
    pillClasses: "border border-[#F5A623] bg-transparent text-[#F5A623]",
  },

  approved: {
    subtitle: "You're good to go.",
    description:
      "Your visitor request has been approved. Please present this profile page at reception when you arrive.",
    reason: "",
    label: "Approved",
    pillClasses: "border border-emerald-500 bg-transparent text-emerald-500",
  },

  rejected: {
    subtitle: "Your request was not approved.",
    description:
      "The administrator did not approve this visit. You can resubmit your request with updated details or contact your host for clarification.",
    reason: "",
    label: "Declined",
    pillClasses: "border border-rose-500 bg-transparent text-rose-500",
    actionLabel: "Register Again",
  },
};

export default function VisitorProfile() {
  const { orgSlug } = useTenant();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const visitorAuth = useAppSelector((state) => state.visitorAuth);

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

  const visitId = storedRegistration?.id;

  const normalizeStatus = useCallback((status?: string | null): VisitorProfileStatus => {
    const normalized = status?.toLowerCase().replace(/[_-]/g, " ").trim();

    if (normalized === "approved" || normalized === "signed in") {
      return "approved";
    }

    if (normalized === "rejected" || normalized === "declined") {
      return "rejected";
    }

    return "pending";
  }, []);

  const {
    data: visitData,
    isLoading: isVisitLoading,
    isFetching: isVisitFetching,
    refetch: refetchVisit,
  } = useGetVisitQuery(visitId ?? "", {
    skip: !visitId || !visitorAuth.accessToken,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const handleStatusChanged = useCallback(
    (data: { visitId: string; status: string }) => {
      if (!visitId || data.visitId !== visitId) {
        return;
      }

      void refetchVisit();
    },
    [visitId, refetchVisit],
  );

  useVisitorSocket({
    token: visitorAuth.accessToken ?? undefined,
    onStatusChanged: handleStatusChanged,
  });

  const displayedRegistration = useMemo<VisitorRegistration | null>(() => {
    if (visitData) {
      return {
        id: visitData.id ?? storedRegistration?.id,

        name: visitData.fullName ?? visitData.name ?? storedRegistration?.name ?? "Visitor",

        purposeOfVisit:
          visitData.purposeOfVisit ?? visitData.purpose ?? storedRegistration?.purposeOfVisit ?? "",

        hostName: visitData.hostName ?? visitData.host ?? storedRegistration?.hostName ?? "",

        department: visitData.department ?? storedRegistration?.department ?? "",

        phoneNo: visitData.phoneNumber ?? visitData.phone ?? storedRegistration?.phoneNo ?? "",

        email: visitData.email ?? storedRegistration?.email ?? "",

        status: normalizeStatus(visitData.status ?? storedRegistration?.status),

        requestId: visitData.referenceId ?? visitData.id ?? storedRegistration?.requestId,

        createdAt: visitData.createdAt ?? storedRegistration?.createdAt,

        badgeNumber: visitData.badgeNumber ?? storedRegistration?.badgeNumber,

        reason: visitData.rejectionReason ?? visitData.reason ?? storedRegistration?.reason,
      };
    }

    return storedRegistration;
  }, [visitData, storedRegistration, normalizeStatus]);

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

  const registration = displayedRegistration;

  const status = normalizeStatus(registration?.status ?? searchParams.get("status"));

  const meta = statusMeta[status];

  const isPending = status === "pending";

  const requestId = registration?.requestId ? `#${registration.requestId}` : "Pending";

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

  if (!visitorAuth.accessToken && !registration) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Visitor session not found.
          </p>

          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Please complete identity verification again to continue.
          </p>

          <Button
            type="primary"
            size="large"
            className="mt-6"
            onClick={() => navigate(paths.verify.getHref(orgSlug))}
          >
            Return to verification
          </Button>
        </div>
      </div>
    );
  }

  if (isVisitLoading && !registration) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingRing />
      </div>
    );
  }

  if (!registration) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Visitor registration data could not be loaded.
          </p>

          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Please complete registration again to view your visitor request status.
          </p>

          <Button
            type="primary"
            size="large"
            className="mt-6"
            onClick={() => navigate(paths.register.getHref(orgSlug))}
          >
            Return to registration
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-white px-4 py-8 dark:bg-slate-950">
      <main className="flex w-full max-w-xl flex-col">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{meta.subtitle}</h1>

          <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            {meta.description}
          </p>
        </div>

        {status === "rejected" && reason && (
          <div className="mt-8 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <p className="text-xs font-medium text-slate-400">Reason for refusal</p>

            <div className="mt-2.5 flex items-start gap-2">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" strokeWidth={2} />

              <p className="text-[15px] leading-snug font-semibold text-slate-800 dark:text-slate-100">
                {reason}
              </p>
            </div>
          </div>
        )}

        <section className="mt-8 w-full rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left shadow-sm md:p-6 dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[19px] font-bold text-slate-900 dark:text-slate-100">
                {registration.name}
              </p>

              <p className="mt-1 text-sm text-slate-400">ID: {requestId}</p>
            </div>

            {isVisitFetching && <span className="text-xs text-slate-400">Updating...</span>}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-slate-200 pt-4 dark:border-slate-700">
            <div>
              <p className="text-[11px] font-medium tracking-wide text-slate-400 uppercase">Host</p>

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
              <p className="text-[11px] font-medium tracking-wide text-slate-400 uppercase">Date</p>

              <p className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">
                {createdDate}
              </p>
            </div>

            <div>
              <p className="text-[11px] font-medium tracking-wide text-slate-400 uppercase">Time</p>

              <p className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">
                {createdTime}
              </p>
            </div>

            <div>
              <p className="text-[11px] font-medium tracking-wide text-slate-400 uppercase">
                Status
              </p>

              <span
                className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${meta.pillClasses}`}
              >
                {meta.label}
              </span>
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

        {!isPending && meta.actionLabel && (
          <div className="mt-auto w-full pt-8">
            <Button
              type="primary"
              block
              size="large"
              className="h-12! rounded-xl! bg-sky-400! text-[15px]! font-semibold hover:bg-sky-500! disabled:opacity-50!"
              onClick={() => navigate(actionPath)}
            >
              Register Again
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
