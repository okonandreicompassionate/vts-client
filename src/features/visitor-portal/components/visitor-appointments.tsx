import { Alert, Button, Pagination } from "antd";
import { useCallback, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/lib/stores/hooks";
import { paths } from "@/config/paths";
import { Spinner } from "@/components/ui/spinner";
import { VISIT_TIME_ZONE } from "@/utils/visit-time";
import { useOrganization } from "../hooks/use-organization";
import { useGetVisitorAppointmentsQuery } from "../api/visitor-visits-api-slice";
import { useVisitorSse } from "../hooks/use-visitor-sse";
import { normalizeVisitorStatus } from "../utils/visitor-status";
import { statusMeta } from "../types/status-meta";

export default function VisitorAppointments() {
  const { orgSlug } = useOrganization();
  const navigate = useNavigate();
  const sessionKey = useAppSelector(
    (state) =>
      `${state.visitorAuth.visitorId ?? "cookie"}:${state.visitorAuth.sessionVisitId ?? "verified"}`,
  );
  const [page, setPage] = useState(1);
  const {
    currentData: data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetVisitorAppointmentsQuery(
    { page, orgSlug, sessionKey },
    {
      pollingInterval: 15000,
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    },
  );
  const onStatusChanged = useCallback(() => {
    void refetch();
  }, [refetch]);
  useVisitorSse({ onStatusChanged });
  const verifyHref = paths.verify.getHref(orgSlug) + "?intent=appointments";
  if (isLoading || (isFetching && !data)) return <Spinner variant="page" />;
  if (isError || !data) {
    const needsSignIn =
      error && "status" in error && (error.status === 401 || error.status === 403);
    return (
      <div className="space-y-4">
        <Alert
          type={needsSignIn ? "info" : "error"}
          showIcon
          message={
            needsSignIn
              ? "Verify your email to view your appointments."
              : "Your appointments could not be loaded."
          }
        />
        <Button onClick={() => (needsSignIn ? navigate(verifyHref) : void refetch())}>
          {needsSignIn ? "Verify email" : "Try again"}
        </Button>
      </div>
    );
  }
  if (data.orgSlug !== orgSlug)
    return <Navigate to={paths.visitorAppointments.getHref(data.orgSlug)} replace />;
  return (
    <section className="w-full space-y-5" aria-labelledby="my-appointments-title">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1
          id="my-appointments-title"
          className="text-xl font-semibold text-slate-900 dark:text-zinc-100"
        >
          {data.restricted ? "Your appointment" : "My appointments"}
        </h1>
        <Button type="primary" onClick={() => navigate(paths.register.getHref(orgSlug))}>
          Request a visit
        </Button>
      </header>
      <p className="text-sm text-slate-500 dark:text-zinc-400">
        Each visit has its own reference, host, schedule and status.
      </p>
      {data.restricted && (
        <Alert
          type="info"
          showIcon
          message="Only your current request is available without email verification."
          action={
            <Button size="small" onClick={() => navigate(verifyHref)}>
              Verify email
            </Button>
          }
        />
      )}
      {data.data.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-500 dark:text-zinc-400">
          You have no appointments yet.
        </p>
      ) : (
        <ul className="space-y-3" aria-busy={isFetching}>
          {data.data.map((visit) => {
            const meta = statusMeta[normalizeVisitorStatus(visit.status)];
            const scheduled = visit.scheduledAt
              ? new Date(visit.scheduledAt).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeZone: VISIT_TIME_ZONE,
                  timeStyle: "short",
                })
              : "Walk-in · no scheduled time";
            return (
              <li key={visit.id}>
                <button
                  type="button"
                  onClick={() => navigate(paths.visitorProfile.getHref(orgSlug, visit.id))}
                  className="w-full cursor-pointer rounded-xl border border-slate-200 bg-white p-4 text-left transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-sky-500 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-semibold wrap-anywhere text-slate-900 dark:text-zinc-100">
                      {visit.referenceId}
                    </span>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${meta.pillClasses}`}
                    >
                      {meta.label}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-900 dark:text-zinc-100">
                    {visit.hostName || "Unassigned host"} · {visit.purpose}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">{scheduled}</p>
                </button>
              </li>
            );
          })}
        </ul>
      )}
      {data.meta.total > data.meta.limit && (
        <Pagination
          current={page}
          pageSize={data.meta.limit}
          total={data.meta.total}
          showSizeChanger={false}
          onChange={setPage}
        />
      )}
    </section>
  );
}
