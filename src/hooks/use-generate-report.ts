import { useState } from "react";
import { message } from "antd";

import { downloadCsv, type CsvColumn } from "@/utils/export-csv";

/** The server's largest page size, so a report needs as few requests as possible. */
export const REPORT_PAGE_SIZE = 100;

interface ReportPage<T> {
  rows: T[];
  hasNextPage: boolean;
}

/** Loads every page of a paged list, one request at a time. */
export async function fetchAllPages<T>(
  fetchPage: (page: number, limit: number) => Promise<ReportPage<T>>,
): Promise<T[]> {
  const rows: T[] = [];

  for (let page = 1; ; page++) {
    const result = await fetchPage(page, REPORT_PAGE_SIZE);
    rows.push(...result.rows);
    if (!result.hasNextPage || result.rows.length === 0) return rows;
  }
}

interface GenerateReportOptions<T> {
  /** File name without date or extension, e.g. "visitors". */
  name: string;
  columns: CsvColumn<T>[];
  /** Every row the report should contain, i.e. all rows matching the page's filters. */
  loadRows: () => Promise<T[]> | T[];
}

/** Downloads a CSV report of everything matching the page's filters, not just the page on screen. */
export function useGenerateReport() {
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const generateReport = async <T>({ name, columns, loadRows }: GenerateReportOptions<T>) => {
    setIsGeneratingReport(true);

    try {
      const rows = await loadRows();

      if (rows.length === 0) {
        message.info("There is nothing to include in the report.");
        return;
      }

      const date = new Date().toISOString().slice(0, 10);
      downloadCsv(`${name}-report-${date}`, columns, rows);
      message.success(`Report generated with ${rows.length.toLocaleString()} ${rows.length === 1 ? "row" : "rows"}.`);
    } catch {
      message.error("The report could not be generated. Please try again.");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return { generateReport, isGeneratingReport };
}
