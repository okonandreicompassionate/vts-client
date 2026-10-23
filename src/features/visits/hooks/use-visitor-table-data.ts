import { useQuery } from "@apollo/client/react";
import { useMemo } from "react";

import { useOrganization } from "@/features/organizations";
import {
  GET_APPOINTMENT_VISITS,
  GET_CHECK_IN_VISITS,
  GET_VISITS,
  type VisitGroupQueryResult,
  type VisitGroupQueryVariables,
  type VisitsQueryResult,
  type VisitsQueryVariables,
} from "@/features/visits/api/graphql/visits.graphql";
import { toVisitorRow, type VisitorRow } from "../utils/visits";
import type { VisitRecord } from "../types/api-types";

interface UseVisitorTableDataParams {
  page: number;
  limit: number;
  status?: string;
  search?: string;
  statusGroup?: "appointments" | "check-ins";
}

export function useVisitorTableData({
  page,
  limit,
  status,
  search,
  statusGroup,
}: UseVisitorTableDataParams) {
  const { orgSlug } = useOrganization();

  const groupedQuery =
    statusGroup === "appointments"
      ? GET_APPOINTMENT_VISITS
      : statusGroup === "check-ins"
        ? GET_CHECK_IN_VISITS
        : undefined;
  const query = groupedQuery ?? GET_VISITS;
  const variables: VisitsQueryVariables | VisitGroupQueryVariables = statusGroup
    ? {
        orgId: orgSlug,
        limit: page * limit,
        search: search ?? null,
      }
    : {
        orgId: orgSlug,
        page,
        limit,
        status: status ?? null,
        search: search ?? null,
      };

  const { data, loading, error } = useQuery<
    VisitsQueryResult | VisitGroupQueryResult,
    VisitsQueryVariables | VisitGroupQueryVariables
  >(query, {
    variables,
    skip: !orgSlug,
    notifyOnNetworkStatusChange: true,
  });

  const visitorRecords = useMemo<VisitorRow[]>(() => {
    if (!data) {
      return [];
    }

    if ("visits" in data) {
      return data.visits.data.map((visit, index) =>
        toVisitorRow(visit as VisitRecord, index),
      );
    }

    const pages =
      statusGroup === "appointments"
        ? [data.pending, data.approved, data.rejected]
        : [data.signedIn, data.signedOff];

    return pages
      .flatMap((result) =>
        result?.data.map((visit, index) => toVisitorRow(visit as VisitRecord, index)) ?? [],
      )
      .sort((left, right) => {
        const leftDate = Date.parse(left.registeredAt);
        const rightDate = Date.parse(right.registeredAt);
        if (Number.isNaN(leftDate) || Number.isNaN(rightDate)) return 0;
        return rightDate - leftDate;
      })
      .slice((page - 1) * limit, page * limit);
  }, [data, limit, page, statusGroup]);

  const totalEntries =
    data && "visits" in data
      ? data.visits.meta.total
      : data
        ? (statusGroup === "appointments"
            ? [data.pending, data.approved, data.rejected]
            : [data.signedIn, data.signedOff]
          ).reduce((total, result) => total + (result?.meta.total ?? 0), 0)
        : 0;

  return {
    visitorRecords,
    totalEntries,
    isLoading: loading,
    isError: Boolean(error),
  };
}