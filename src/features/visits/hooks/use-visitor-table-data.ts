import { useQuery } from "@apollo/client/react";
import { useMemo } from "react";

import { useOrganization } from "@/features/organizations";
import {
  GET_APPOINTMENT_VISITS,
  GET_VISITS,
  type VisitGroupQueryResult,
  type VisitGroupQueryVariables,
  type VisitsQueryResult,
  type VisitsQueryVariables,
} from "@/features/visits/api/graphql/visits.graphql";
import { useGetVisitStatsQuery } from "@/features/visits/api/admins-visit-api-slice";
import { toVisitorRow } from "../utils/visits";
import type { VisitRecord } from "../types/api-types";

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
  const { orgSlug } = useOrganization();

  const groupedQuery = statusGroup
    ? statusGroup === "appointments"
      ? GET_APPOINTMENT_VISITS
      : GET_VISITS
    : undefined;
  const query = groupedQuery ?? GET_VISITS;
  const isSignedStatus = status === "SIGNED_IN" || status === "SIGNED_OFF";
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
      ((!statusGroup || statusGroup === "appointments") && !isSignedStatus),
  });
  const variables: VisitsQueryVariables | VisitGroupQueryVariables =
    statusGroup === "appointments"
      ? {
          orgId: orgSlug,
          limit: page * limit,
          search: search ?? null,
        }
      : {
          orgId: orgSlug,
          page: isSignedStatus ? 1 : page,
          limit: isSignedStatus
            ? Math.max(stats?.total ?? (includeStats ? page * limit : 100), 1)
            : limit,
          status:
            statusGroup === "visitors" ||
            (statusGroup === "check-ins" && (isSignedStatus || status === "ALL"))
              ? null
              : isSignedStatus
                ? null
                : (status ?? null),
          search: search ?? null,
        };

  const { data, loading, error, refetch } = useQuery<
    VisitsQueryResult | VisitGroupQueryResult,
    VisitsQueryVariables | VisitGroupQueryVariables
  >(query, {
    variables,
    skip: !orgSlug || !enabled,
    notifyOnNetworkStatusChange: true,
    pollInterval: statusGroup === "appointments" || statusGroup === "check-ins" ? 30_000 : 0,
  });

  const { visitorRecords, filteredTotal } = useMemo(() => {
    if (!data) {
      return { visitorRecords: [], filteredTotal: 0 };
    }

    if ("visits" in data) {
      const rows = data.visits.data.map((visit, index) =>
        toVisitorRow(visit as VisitRecord, index),
      );

      if (
        statusGroup === "check-ins" &&
        !isSignedStatus &&
        (status === "ALL" || Boolean(status))
      ) {
        return { visitorRecords: rows, filteredTotal: data.visits.meta.total };
      }

      if (statusGroup === "visitors" || statusGroup === "check-ins" || isSignedStatus) {
        const filteredRows = rows.filter((visit) => {
          if (status === "SIGNED_IN") return visit.status === "Signed In";
          if (status === "SIGNED_OFF") return visit.status === "Signed Off";
          if (status === "APPROVED") return visit.status === "Approved";
          if (status === "PENDING") return visit.status === "Pending";
          if (status === "REJECTED") return visit.status === "Rejected";
          if (status === "ALL") return true;
          return (
            visit.status === "Approved" ||
            visit.status === "Signed In" ||
            visit.status === "Signed Off"
          );
        });

        return {
          visitorRecords: filteredRows.slice((page - 1) * limit, page * limit),
          filteredTotal: filteredRows.length,
        };
      }

      return { visitorRecords: rows, filteredTotal: data.visits.meta.total };
    }

    if (statusGroup === "appointments" && appointmentStatusKey) {
      const records = (
        data[appointmentStatusKey]?.data.map((visit, index) =>
          toVisitorRow(visit as VisitRecord, index),
        ) ?? []
      );
      return {
        visitorRecords: records.slice((page - 1) * limit, page * limit),
        filteredTotal: data[appointmentStatusKey]?.meta.total ?? records.length,
      };
    }

    const records = (data.all?.data ?? []).map((visit, index) =>
      toVisitorRow(visit as VisitRecord, index),
    );

    return {
      visitorRecords: records.slice((page - 1) * limit, page * limit),
      filteredTotal: data.all?.meta.total ?? records.length,
    };
  }, [appointmentStatusKey, data, isSignedStatus, limit, page, status, statusGroup]);

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
          ? Math.max(
              0,
              (stats?.total ?? 0) -
                (stats?.pending ?? 0) -
                (stats?.rejected ?? 0) -
                (stats?.signedIn ?? 0) -
                (stats?.signedOff ?? 0),
            )
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
    errorMessage: error?.message,
    refetch: () => refetch(),
    appointmentCounts,
  };
}