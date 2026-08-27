import { Button } from "antd";
import { useCallback, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import LoadingRing from "../animations/loading-ring";
import { paths } from "../../../config/paths";
import { useOrganization } from "@/features/organizations";
import type {
  VisitorProfileStatus,
  VisitorRegistration,
} from "../types/visitor-profile";
import { useAppSelector } from "@/lib/stores/hooks";
import MetaItem from "./profile-meta-item";
import { statusMeta } from "../types/status-meta";
import { useGetVisitQuery } from "../api/visitor-vists-api";
import type { VisitResponse } from "../types/api-types";
import { useVisitorSse } from "../hooks/use-visitor-sse";

export default function VisitorProfile() {
  const { orgSlug } = useOrganization();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const visitorAuth = useAppSelector(
    (state) => state.visitorAuth,
  );

  const storedRegistration =
    useMemo<VisitorRegistration | null>(() => {
      if (typeof window === "undefined") {
        return null;
      }

      const stored = window.localStorage.getItem(
        "visitorRegistration",
      );

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

  const normalizeStatus = useCallback(
    (
      status?: string | null,
    ): VisitorProfileStatus => {
      const normalized = status
        ?.toLowerCase()
        .replace(/[_-]/g, " ")
        .trim();

      if (
        normalized === "approved" ||
        normalized === "signed in" ||
        normalized === "signed off"
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

  const {
    data: visitData,
    isLoading: isVisitLoading,
    isFetching: isVisitFetching,
    refetch: refetchVisit,
  } = useGetVisitQuery(visitId ?? "", {
    skip: !visitId,
    pollingInterval: 15000,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const handleStatusChanged = useCallback(
    (data: {
      visitId: string;
      status: string;
    }) => {
      if (
        !visitId ||
        data.visitId !== visitId
      ) {
        return;
      }

      void refetchVisit();
    },
    [visitId, refetchVisit],
  );

  useVisitorSse({
    onStatusChanged: handleStatusChanged,
  });

  const displayedRegistration =
    useMemo<VisitorRegistration | null>(() => {
      if (!visitData) {
        return storedRegistration;
      }

      const response = visitData as VisitResponse;

      return {
        id: response.id,
        name:
          response.fullName ??
          response.name ??
          storedRegistration?.name ??
          "Visitor",
        purposeOfVisit:
          response.purpose ??
          storedRegistration?.purposeOfVisit ??
          "",
        hostName:
          response.hostName ??
          storedRegistration?.hostName ??
          "",
        phoneNo:
          response.phoneNumber ??
          storedRegistration?.phoneNo ??
          "",
        email:
          response.email ??
          storedRegistration?.email ??
          "",
        status: normalizeStatus(response.status),
        requestId:
          response.referenceId ??
          response.id ??
          storedRegistration?.requestId,
        createdAt:
          response.createdAt ??
          response.registeredAt ??
          storedRegistration?.createdAt,
      };
    }, [
      visitData,
      storedRegistration,
      normalizeStatus,
    ]);

  useEffect(() => {
    if (
      !displayedRegistration ||
      typeof window === "undefined"
    ) {
      return;
    }

    window.localStorage.setItem(
      "visitorRegistration",
      JSON.stringify(displayedRegistration),
    );
  }, [displayedRegistration]);

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

  const actionPath =
    status === "rejected"
      ? paths.register.getHref(orgSlug)
      : paths.home.getHref(orgSlug);

  if (
    !visitorAuth.isAuthenticated &&
    !registration
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Visitor session not found.
          </p>

          <p className="mt-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
            Please complete identity verification again to
            continue.
          </p>

          <Button
            type="primary"
            size="large"
            className="mt-6 font-semibold"
            onClick={() =>
              navigate(
                paths.verify.getHref(orgSlug),
              )
            }
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
            Please complete registration again to view your
            visitor request status.
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

        <section className="mt-6 w-full rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left shadow-sm md:p-6 dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-start justify-between gap-1">
            <div>
              <p className="text-[19px] font-bold text-slate-900 dark:text-slate-100">
                {registration.name}
              </p>

              <p className="mt-1 text-sm text-slate-400">
                ID: {requestId}
              </p>
            </div>

            {isVisitFetching && (
              <span className="text-xs text-slate-400">
                Updating...
              </span>
            )}
          </div>

          <div className="w-full mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-slate-200 pt-3 dark:border-slate-700">
            <MetaItem
              label="Host"
              value={
                registration.hostName ||
                "Pending"
              }
            />

            <MetaItem
              label="Date"
              value={createdDate}
            />

            <MetaItem
              label="Time"
              value={createdTime}
            />

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

            <MetaItem
              label="Phone No"
              value={
                registration.phoneNo ||
                "Pending"
              }
            />

            <MetaItem
              label="Email"
              value={
                registration.email ||
                "Pending"
              }
            />

            <MetaItem
              label="Purpose of Visit"
              value={
                registration.purposeOfVisit ||
                "Pending"
              }
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
              onClick={() =>
                navigate(actionPath)
              }
            >
              Register Again
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
