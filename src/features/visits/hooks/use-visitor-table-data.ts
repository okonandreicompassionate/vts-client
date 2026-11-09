import { useMemo } from "react";

import {
  useGetVisitStatsQuery,
  useGetVisitsQuery,
} from "@/features/visits/api/admins-visit-api-slice";
import { toVisitorRow, type VisitorRow } from "../utils/visits";
import type { VisitListPage, VisitListParams, VisitRecord } from "../types/api-types";

type AppointmentGroupKey = "all" | "pending" | "approved" | "rejected";

export type VisitStatusGroup = "appointments" | "check-ins" | "visitors";

const isSignedStatus = (status?: string) => status === "SIGNED_IN" || status === "SIGNED_OFF";
const APPOINTMENT_STATUSES = ["PENDING", "APPROVED", "REJECTED"];

/** The status sent to the server for a view, or null when the view filters by status here. */
export function getVisitListStatus(status?: string, statusGroup?: VisitStatusGroup): string | null {
  if (statusGroup === "appointments") {
    return status && APPOINTMENT_STATUSES.includes(status) ? status : null;
  }
  if (statusGroup === "visitors" || isSignedStatus(status)) return null;
  if (statusGroup === "check-ins" && status === "ALL") return null;

  return status ?? null;
}

/** Signed in/off are worked out from check-in times, so some views filter by status here. */
export function needsClientStatusFilter(status?: string, statusGroup?: VisitStatusGroup): boolean {
  if (statusGroup === "appointments") return false;
  if (statusGroup === "check-ins" && !isSignedStatus(status) && Boolean(status)) return false;

  return statusGroup === "visitors" || statusGroup === "check-ins" || isSignedStatus(status);
}

export function matchesVisitorStatus(visit: VisitorRow, status?: string): boolean {
  if (status === "SIGNED_IN") return visit.status === "Signed In";
  if (status === "SIGNED_OFF") return visit.status === "Signed Off";
  if (status === "APPROVED") return visit.status === "Approved";
  if (status === "PENDING") return visit.status === "Pending";
  if (status === "REJECTED") return visit.status === "Rejected";
  if (status === "ALL") return true;

  return (
    visit.status === "Approved" || visit.status === "Signed In" || visit.status === "Signed Off"
  );
}

type VisitListData =
  | { visits: VisitListPage }
  | Partial<Record<AppointmentGroupKey, VisitListPage>>;

interface UseVisitorTableDataParams {
  page: number;
  limit: number;
  status?: string;
  search?: string;
  statusGroup?: "appointments" | "check-ins" | "visitors";
  enabled?: boolean;
  includeStats?: boolean;
}

interface AppointmentCounts {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export function useVisitorTableData({
  page,
  limit,
  status,
  search,
  statusGroup,
  enabled = true,
  includeStats = true,
}: UseVisitorTableDataParams) {
  const isAppointments = statusGroup === "appointments";
  const isSigned = isSignedStatus(status);
  const appointmentStatusKey =
    status === "PENDING"
      ? "pending"
      : status === "APPROVED"
        ? "approved"
        : status === "REJECTED"
          ? "rejected"
          : undefined;
  const { data: stats } = useGetVisitStatsQuery(undefined, {
    skip:
      !enabled ||
      !includeStats ||
      ((!statusGroup || statusGroup === "appointments") && !isSigned),
  });
  const listParams: VisitListParams = {
    page: isSigned ? 1 : page,
    limit: isSigned
      ? Math.max(stats?.total ?? (includeStats ? page * limit : 100), 1)
      : limit,
    status: getVisitListStatus(status, statusGroup),
    search: search ?? null,
  };

  // The appointments view shows every status tab's count. Only the tab on screen
  // loads a real page; the others load a single row just to read their totals.
  const activeGroupStatus = appointmentStatusKey ? (status ?? null) : null;
  const groupParams = (groupStatus: string | null): VisitListParams =>
    groupStatus === activeGroupStatus
      ? { page, limit, status: groupStatus, search: search ?? null }
      : { page: 1, limit: 1, status: groupStatus, search: search ?? null };

  const queryOptions = {
    pollingInterval: isAppointments || statusGroup === "check-ins" ? 30_000 : 0,
  };
  const listQuery = useGetVisitsQuery(listParams, {
    ...queryOptions,
    skip: !enabled || isAppointments,
  });
  const groupSkip = { ...queryOptions, skip: !enabled || !isAppointments };
  const allQuery = useGetVisitsQuery(groupParams(null), groupSkip);
  const pendingQuery = useGetVisitsQuery(groupParams("PENDING"), groupSkip);
  const approvedQuery = useGetVisitsQuery(groupParams("APPROVED"), groupSkip);
  const rejectedQuery = useGetVisitsQuery(groupParams("REJECTED"), groupSkip);

  const activeQueries = isAppointments
    ? [allQuery, pendingQuery, approvedQuery, rejectedQuery]
    : [listQuery];

  const data = useMemo<VisitListData | undefined>(
    () =>
      isAppointments
        ? allQuery.data && {
            all: allQuery.data,
            pending: pendingQuery.data,
            approved: approvedQuery.data,
            rejected: rejectedQuery.data,
          }
        : listQuery.data && { visits: listQuery.data },
    [
      isAppointments,
      allQuery.data,
      pendingQuery.data,
      approvedQuery.data,
      rejectedQuery.data,
      listQuery.data,
    ],
  );

  const loading = activeQueries.some((query) => query.isFetching);
  const error = activeQueries.find((query) => query.error)?.error;
  const errorMessage =
    error && typeof error === "object" && "data" in error
      ? ((error.data as { message?: string } | undefined)?.message ?? "Unable to load visits.")
      : error
        ? "Unable to load visits."
        : undefined;

  const refetch = async () => {
    // Skipped queries can't be refetched.
    if (!enabled) {
      return;
    }

    await Promise.all(activeQueries.map((query) => query.refetch()));
  };

  const { visitorRecords, filteredTotal } = useMemo(() => {
    if (!data) {
      return { visitorRecords: [], filteredTotal: 0 };
    }

    if ("visits" in data) {
      const rows = data.visits.data.map((visit, index) =>
        toVisitorRow(visit as VisitRecord, index),
      );

      if (needsClientStatusFilter(status, statusGroup)) {
        const filteredRows = rows.filter((visit) => matchesVisitorStatus(visit, status));

        return {
          visitorRecords: filteredRows.slice((page - 1) * limit, page * limit),
          filteredTotal: filteredRows.length,
        };
      }

      return { visitorRecords: rows, filteredTotal: data.visits.meta.total };
    }

    // The tab on screen was fetched page by page, so its rows are already this page.
    const activeGroup = data[appointmentStatusKey ?? "all"];
    const records = (activeGroup?.data ?? []).map((visit, index) =>
      toVisitorRow(visit as VisitRecord, index),
    );

    return {
      visitorRecords: records,
      filteredTotal: activeGroup?.meta.total ?? records.length,
    };
  }, [appointmentStatusKey, data, limit, page, status, statusGroup]);

  const appointmentCounts: AppointmentCounts | undefined =
    statusGroup === "appointments" && data && !("visits" in data)
      ? {
          total: data.all?.meta.total ?? 0,
          pending: data.pending?.meta.total ?? 0,
          approved: data.approved?.meta.total ?? 0,
          rejected: data.rejected?.meta.total ?? 0,
        }
      : undefined;

  const totalEntries =
    data && "visits" in data
      ? statusGroup === "visitors" || statusGroup === "check-ins"
        ? !includeStats
          ? filteredTotal
          : status === "ALL"
          ? stats?.total ?? data.visits.meta.total
          : status === "APPROVED"
          ? stats?.approved ?? 0
          : status === "SIGNED_IN"
            ? stats?.signedIn ?? 0
            : status === "SIGNED_OFF"
              ? stats?.signedOff ?? 0
              : status === "PENDING"
                ? stats?.pending ?? 0
                : status === "REJECTED"
                  ? stats?.rejected ?? 0
                  : Math.max(
                      0,
                      (stats?.total ?? 0) -
                        (stats?.pending ?? 0) -
                        (stats?.rejected ?? 0),
                    )
        : status === "SIGNED_IN"
          ? includeStats ? stats?.signedIn ?? filteredTotal : filteredTotal
          : status === "SIGNED_OFF"
            ? includeStats ? stats?.signedOff ?? filteredTotal : filteredTotal
        : data.visits.meta.total
      : data
        ? filteredTotal
        : 0;

  return {
    visitorRecords,
    totalEntries,
    isLoading: loading,
    isError: Boolean(error),
    errorMessage,
    refetch,
    appointmentCounts,
  };
}