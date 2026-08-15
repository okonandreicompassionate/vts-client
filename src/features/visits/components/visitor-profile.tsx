import { Info } from "lucide-react";
import { Button } from "antd";
import { useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import LoadingRing from "../animations/loading-ring";
import { paths } from "../../../config/paths";
import { useTenant } from "../../../lib/tenant";
import { useGetVisitQuery } from "../api/visit-api-slice";
import type { VisitorProfileStatus, VisitorRegistration } from "../types/visitor-profile";
import { useVisitorSocket } from "../hooks/use-visitor-socket";
import { useAppSelector } from "@/lib/stores/hooks";
import MetaItem from "./profile-meta-item";
import { statusMeta } from "../types/status-meta";

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

          <p className="mt-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
            Please complete identity verification again to continue.
          </p>

          <Button
            type="primary"
            size="large"
            className="mt-6 font-semibold"
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
    <div className="flex min-h-[calc(100dvh-6rem)] w-full items-center justify-center bg-white px-4 py-6 sm:px-6 md:min-h-0 md:px-10 md:py-0 dark:bg-slate-950">
      <main className="flex w-full max-w-xl flex-col">
        <div className="text-center">
          <div className="text-[20px] font-bold text-slate-900 dark:text-slate-100">
            {meta.subtitle}
          </div>

          <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            {meta.description}
          </p>
        </div>

        {status === "rejected" && reason && (
          <div className="mt-4 w-full rounded-2xl border border-slate-200 bg-slate-50 p-2 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <p className="text-xs font-medium text-slate-400">Reason for refusal</p>

            <div className="mt-2 flex items-start gap-2">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" strokeWidth={2} />

              <p className="text-[15px] leading-snug font-semibold text-slate-800 dark:text-slate-100">
                {reason}
              </p>
            </div>
          </div>
        )}

        <section className="mt-6 w-full rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left shadow-sm md:p-6 dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-start justify-between gap-1">
            <div>
              <p className="text-[19px] font-bold text-slate-900 dark:text-slate-100">
                {registration.name}
              </p>

              <p className="mt-1 text-sm text-slate-400">ID: {requestId}</p>
            </div>

            {isVisitFetching && <span className="text-xs text-slate-400">Updating...</span>}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1.5 border-t border-slate-200 pt-3 dark:border-slate-700">
            <MetaItem label="Host" value={registration.hostName || "Pending"} />

            <MetaItem label="Department" value={registration.department || "Pending"} />

            <MetaItem label="Date" value={createdDate} />

            <MetaItem label="Time" value={createdTime} />

            <MetaItem
              label="Status"
              value={
                <span
                  className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${meta.pillClasses}`}
                >
                  {meta.label}
                </span>
              }
            />

            <MetaItem label="Phone No" value={registration.phoneNo || "Pending"} />

            <MetaItem
              label="Purpose of Visit"
              value={registration.purposeOfVisit || "Pending"}
              className="col-span-2"
            />
          </div>
        </section>

        {!isPending && meta.actionLabel && (
          <div className="mt-6 w-full">
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
