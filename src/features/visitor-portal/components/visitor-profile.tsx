import { Button } from "antd";
import { BriefcaseBusiness, Calendar, Check, Clock, Mail, Phone, UserRound, X } from "lucide-react";
import { useCallback, useMemo } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";

import { useOrganization } from "@/features/visitor-portal";
import { useAppSelector } from "@/lib/stores/hooks";
import { VISIT_TIME_ZONE } from "@/utils/visit-time";
import { paths } from "../../../config/paths";
import LoadingRing from "../animations/loading-ring";
import { useGetVisitorVisitQuery } from "../api/visitor-visits-api-slice";
import { useVisitorSse } from "../hooks/use-visitor-sse";
import { statusMeta } from "../types/status-meta";
import type { VisitorRegistration } from "../types/visitor-profile";
import { normalizeVisitorStatus as normalizeStatus } from "../utils/visitor-status";
import MetaItem from "./profile-meta-item";

export default function VisitorProfile() {
  const { orgSlug } = useOrganization();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const visitorAuth = useAppSelector((state) => state.visitorAuth);

  const visitId = searchParams.get("visit");

  const {
    currentData: visitData,
    isError: isVisitError,
    isLoading: isVisitLoading,
    isFetching: isVisitFetching,
    refetch: refetchVisit,
  } = useGetVisitorVisitQuery(
    {
      id: visitId ?? "",
      sessionKey: `${visitorAuth.visitorId ?? "cookie"}:${visitorAuth.sessionVisitId ?? "verified"}`,
    },
    {
      skip: !visitId,
      pollingInterval: 15000,
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    },
  );

  const handleStatusChanged = useCallback(
    (data: { visitId: string; status: string }) => {
      if (!visitId || data.visitId !== visitId) {
        return;
      }

      void refetchVisit();
    },
    [visitId, refetchVisit],
  );

  useVisitorSse({
    onStatusChanged: handleStatusChanged,
  });

  const displayedRegistration = useMemo<VisitorRegistration | null>(() => {
    if (!visitData) {
      return null;
    }

    const response = visitData;

    return {
      id: response.id,
      visitorId: response.visitorId,
      name: response.fullName ?? response.name ?? "Visitor",
      purposeOfVisit: response.purpose ?? "",
      hostName: response.hostName ?? "",
      phoneNo: response.phoneNumber ?? response.phone ?? "",
      email: response.email ?? "",
      status: normalizeStatus(response.status),
      requestId: response.referenceId ?? response.id,
      scheduledAt: response.scheduledAt,
      createdAt: response.createdAt ?? response.registeredAt,
    };
  }, [visitData]);

  const formatDate = (value?: string) => {
    if (!value) {
      return "Pending";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat(undefined, {
      timeZone: VISIT_TIME_ZONE,
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
      timeZone: VISIT_TIME_ZONE,
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

  const createdDate = formatDate(registration?.scheduledAt ?? registration?.createdAt);

  const createdTime = formatTime(registration?.scheduledAt ?? registration?.createdAt);

  const actionPath =
    status === "rejected" || status === "cancelled"
      ? paths.register.getHref(orgSlug)
      : paths.home.getHref(orgSlug);

  if (!visitId) return <Navigate to={paths.visitorAppointments.getHref(orgSlug)} replace />;
  if (visitData && visitData.orgSlug !== orgSlug)
    return <Navigate to={paths.visitorProfile.getHref(visitData.orgSlug, visitId)} replace />;
  if (isVisitError)
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-slate-500 dark:text-zinc-400">
          This appointment could not be loaded or is not available to your session.
        </p>
        <Button onClick={() => navigate(paths.visitorAppointments.getHref(orgSlug))}>
          My appointments
        </Button>
        <Button onClick={() => void refetchVisit()}>Try again</Button>
      </div>
    );
  if ((isVisitLoading || isVisitFetching) && !registration) return <LoadingRing />;

  if (!visitorAuth.isAuthenticated && !registration) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <p className="text-lg font-semibold text-slate-900 dark:text-zinc-100">
            Visitor session not found.
          </p>

          <p className="mt-3 text-sm font-semibold text-slate-500 dark:text-zinc-400">
            Please complete identity verification again to continue.
          </p>

          <Button
            type="primary"
            className="mt-6"
            onClick={() => navigate(paths.verify.getHref(orgSlug))}
          >
            Return to verification
          </Button>
        </div>
      </div>
    );
  }

  if (!registration) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <p className="text-lg font-semibold text-slate-900 dark:text-zinc-100">
            Visitor registration data could not be loaded.
          </p>

          <p className="mt-3 text-sm text-slate-500 dark:text-zinc-400">
            Please complete registration again to view your visitor request status.
          </p>

          <Button
            type="primary"
            className="mt-6"
            onClick={() => navigate(paths.register.getHref(orgSlug))}
          >
            Return to registration
          </Button>
        </div>
      </div>
    );
  }

  const StatusIcon = status === "approved" ? Check : status === "rejected" ? X : Clock;
  return (
    <div className="mt-4 w-full pb-1 lg:mt-20">
     
      <section
        aria-labelledby="request-review-heading"
        className="mb-5 flex flex-col items-center gap-2 text-center sm:mb-8 sm:gap-3"
      >
        {/* <div className="mb-1 flex size-12 items-center justify-center rounded-[20px] border border-slate-200 bg-slate-50 text-slate-500 shadow-sm sm:size-16 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
          <ClipboardCheck className="size-6 sm:size-[30px]" strokeWidth={1.75} aria-hidden="true" />
        </div> */}
        <h1
          id="request-review-heading"
          className="text-lg leading-tight font-semibold text-slate-900 capitalize dark:text-zinc-100"
        >
          {meta.subtitle}
        </h1>
        <p className="max-w-lg max-w-sm text-xs leading-relaxed text-slate-500 md:-mt-2 dark:text-zinc-400">
          {meta.description}
        </p>
      </section>
      <section
        aria-label="Visitor request details"
        className="w-full rounded-[20px] border border-slate-200 bg-slate-50 p-3 shadow-[0_8px_30px_rgba(0,0,0,0.08)] sm:rounded-[24px] sm:p-6 dark:border-zinc-700 dark:bg-zinc-800/10 dark:shadow-[0_8px_30px_rgba(0,0,0,0.18)]"
      >
        <div className="mb-4 flex items-center justify-between gap-2 border-b border-slate-200 pb-2 sm:gap-4 dark:border-zinc-700">
          <div className="min-w-0">
            <h2 className="text-sm leading-snug font-semibold wrap-anywhere text-slate-900 sm:text-xl dark:text-zinc-100">
              {registration.name}
            </h2>
            <p className="mt-1 text-[10px] leading-4 wrap-anywhere text-slate-500 sm:text-[13px] dark:text-zinc-400">
              ID: {requestId}
            </p>
          </div>
          <span
            role="status"
            className={
              "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold sm:gap-2 sm:px-3.5 sm:py-1.5 sm:text-[13px] " +
              meta.pillClasses
            }
          >
            <StatusIcon className="size-3.5 sm:size-4" aria-hidden="true" />
            {meta.label}
          </span>
        </div>
        <dl className="grid min-w-0 grid-cols-2 gap-2 sm:gap-4">
          <MetaItem
            icon={Mail}
            label="Email"
            value={registration.email || "Pending"}
            className="col-span-2"
          />
          <MetaItem icon={Calendar} label="Date" value={createdDate} />
          <MetaItem icon={Clock} label="Time" value={createdTime} />
          <MetaItem icon={UserRound} label="Host" value={registration.hostName || "Pending"} />
          <MetaItem icon={Phone} label="Phone No" value={registration.phoneNo || "Pending"} />
          <MetaItem
            icon={BriefcaseBusiness}
            label="Purpose of Visit"
            value={registration.purposeOfVisit || "Pending"}
            className="col-span-2"
          />
        </dl>
        {isVisitFetching && (
          <p role="status" className="mt-3 text-center text-xs text-slate-400 dark:text-zinc-400">
            Updating...
          </p>
        )}
      </section>
      {!isPending && meta.actionLabel && (
        <div className="mt-6 w-full">
          <Button type="primary" block onClick={() => navigate(actionPath)}>
            {meta.actionLabel}
          </Button>
        </div>
      )}
       {/* <Button
        type="link"
        className="mb-4 px-0! self-start px-0! place-self-center w-full"
        onClick={() => navigate(paths.visitorAppointments.getHref(orgSlug))}
      >
        My appointments
      </Button> */}
    </div>
  );
}
