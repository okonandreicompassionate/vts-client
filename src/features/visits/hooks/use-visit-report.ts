import { fetchAllPages, useGenerateReport } from "@/hooks/use-generate-report";
import type { CsvColumn } from "@/utils/export-csv";
import { useAppDispatch } from "@/lib/stores/hooks";
import { adminVisitsApi } from "../api/admins-visit-api-slice";
import type { VisitRecord } from "../types/api-types";
import { visitorReportColumns } from "../utils/export-visitors";
import { toVisitorRow, type VisitorRow } from "../utils/visits";
import {
  getVisitListStatus,
  matchesVisitorStatus,
  needsClientStatusFilter,
  type VisitStatusGroup,
} from "./use-visitor-table-data";

interface VisitReportFilters {
  status?: string;
  search?: string;
  statusGroup?: VisitStatusGroup;
  /** Any extra filter the page applies in the browser. */
  filter?: (row: VisitorRow) => boolean;
  columns?: CsvColumn<VisitorRow>[];
}

/** A visit report with the same filters as the table on screen (same arguments as useVisitorTableData). */
export function useVisitReport(name: string) {
  const dispatch = useAppDispatch();
  const { generateReport, isGeneratingReport } = useGenerateReport();

  const generateVisitReport = ({
    status,
    search,
    statusGroup,
    filter,
    columns = visitorReportColumns,
  }: VisitReportFilters) =>
    generateReport({
      name,
      columns,
      loadRows: async () => {
        const visits = await fetchAllPages(async (page, limit) => {
          const result = await dispatch(
            adminVisitsApi.endpoints.getVisits.initiate(
              { page, limit, status: getVisitListStatus(status, statusGroup), search: search ?? null },
              { subscribe: false, forceRefetch: true },
            ),
          ).unwrap();

          return { rows: result.data, hasNextPage: result.meta.hasNextPage };
        });

        const rows = visits.map((visit, index) => toVisitorRow(visit as VisitRecord, index));

        return rows.filter(
          (row) =>
            (!needsClientStatusFilter(status, statusGroup) || matchesVisitorStatus(row, status)) &&
            (!filter || filter(row)),
        );
      },
    });

  return { generateVisitReport, isGeneratingReport };
}
