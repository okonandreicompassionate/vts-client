import { useMemo } from "react";
import { useGetVisitsQuery } from "../api/admin-api";
import { toVisitorRow, type VisitorRow } from "../utils/visits";
import type { VisitRecord } from "../../../lib/api/types";

interface UseVisitorTableDataParams {
  page: number;
  limit: number;
  status?: string;
}

export function useVisitorTableData({ page, limit, status }: UseVisitorTableDataParams) {
  const { data: visitsData } = useGetVisitsQuery({
    page,
    limit,
    status,
  });

  const visitorRecords = useMemo<VisitorRow[]>(() => {
    if (!visitsData || !visitsData.data) return [];
    return visitsData.data.map((visit: VisitRecord, index: number) => toVisitorRow(visit, index));
  }, [visitsData]);

  const totalEntries = visitsData?.total ?? 0;

  return { visitorRecords, totalEntries };
}
