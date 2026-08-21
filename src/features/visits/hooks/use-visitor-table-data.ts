import { useMemo } from "react";
import { useGetVisitsQuery } from "../api/admins-visit-api-slice"
import { toVisitorRow, type VisitorRow } from "../utils/visits";
import type { VisitRecord } from "../types/api-types";

interface UseVisitorTableDataParams {
  page: number;
  limit: number;
  status?: string;
}

export function useVisitorTableData({ page, limit, status }: UseVisitorTableDataParams) {
  const { data: visitsData, isLoading, isError } = useGetVisitsQuery({
    page,
    limit,
    status,
  });

  const visitorRecords = useMemo<VisitorRow[]>(() => {
    if (!visitsData?.data) {
      return [];
    }
    return visitsData.data.map((visit: VisitRecord, index) => toVisitorRow(visit, index));
  }, [visitsData]);

  const totalEntries = visitsData?.meta.total ?? 0;

  return {
    visitorRecords,
    totalEntries,
    isLoading,
    isError,
  };
}