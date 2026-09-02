import { useQuery } from "@apollo/client/react";
import { useMemo } from "react";

import { useOrganization } from "@/features/organizations";
import {
  GET_VISITS,
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
}

export function useVisitorTableData({
  page,
  limit,
  status,
  search,
}: UseVisitorTableDataParams) {
  const { orgSlug } = useOrganization();

  const { data, loading, error } = useQuery<VisitsQueryResult, VisitsQueryVariables>(
    GET_VISITS,
    {
      variables: {
        orgId: orgSlug,
        page,
        limit,
        status: status ?? null,
        search: search ?? null,
      },
      skip: !orgSlug,
      notifyOnNetworkStatusChange: true,
    },
  );

  const visitorRecords = useMemo<VisitorRow[]>(() => {
    if (!data?.visits?.data) {
      return [];
    }

    return data.visits.data.map((visit, index) =>
      toVisitorRow(visit as VisitRecord, index),
    );
  }, [data]);

  const totalEntries = data?.visits.meta.total ?? 0;

  return {
    visitorRecords,
    totalEntries,
    isLoading: loading,
    isError: Boolean(error),
  };
}