import { Button, Pagination } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import type { ReactNode } from "react";

import TableComponent from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

interface DataTableCardProps<T extends object> {
  columns: ColumnsType<T>;
  dataSource: T[];
  rowKey: keyof T | ((record: T) => string | number);
  loading?: boolean;
  /** Shown instead of the rows when loading failed. */
  error?: { message: string; onRetry?: () => void } | null;
  /** Shown when there are no rows (and no error). */
  empty?: ReactNode;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
    pageSizeOptions?: number[];
  };
  showSerialNumber?: boolean;
  serialNumberTitle?: string;
  /** Opens the row (its details drawer). Rows are clickable and keyboard-focusable (Enter/Space). */
  onRowClick?: (record: T) => void;
  rowSelection?: TableProps<T>["rowSelection"];
  className?: string;
}

/**
 * A table in a card with loading/error/empty states and a pagination footer.
 * Page actions (reports, bulk actions) belong in the PageShell header, not here.
 */
export function DataTableCard<T extends object>({
  columns,
  dataSource,
  rowKey,
  loading = false,
  error,
  empty,
  pagination,
  showSerialNumber = true,
  serialNumberTitle = "SN",
  onRowClick,
  rowSelection,
  className = "",
}: DataTableCardProps<T>) {
  const showEmpty = !loading && !error && dataSource.length === 0 && empty;
  const startIndex = pagination ? (pagination.page - 1) * pagination.pageSize + 1 : 1;

  return (
    <section className="data-table-card flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-zinc-700 dark:bg-zinc-800">
      <div className="data-table-scroll relative min-h-[12rem] min-w-0 flex-1 overflow-auto overscroll-contain">
        {loading && (
          <Spinner variant="inline" overlay className="bg-white/70 dark:bg-zinc-800/70" />
        )}

        {error ? (
          <div
            role="alert"
            className="flex flex-col items-center justify-center gap-2 px-4 py-12 text-center"
          >
            <p className="text-sm text-rose-600 dark:text-rose-400">{error.message}</p>
            {error.onRetry && (
              <Button size="small" onClick={error.onRetry}>
                Retry
              </Button>
            )}
          </div>
        ) : showEmpty ? (
          <div className="flex flex-col items-center justify-center gap-2 px-4 py-12 text-center">
            {empty}
          </div>
        ) : (
          <TableComponent<T>
            columns={columns}
            dataSource={dataSource}
            rowKey={rowKey}
            className={className}
            size="small"
            showSerialNumber={showSerialNumber}
            serialNumberTitle={serialNumberTitle}
            startIndex={startIndex}
            onRow={
              onRowClick
                ? (record) => ({
                    onClick: () => onRowClick(record),
                    onKeyDown: (event) => {
                      // Only the row itself: keys inside its controls (e.g. the actions menu) are theirs.
                      if (event.target !== event.currentTarget) return;
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onRowClick(record);
                      }
                    },
                    tabIndex: 0,
                    className: "cursor-pointer",
                  })
                : undefined
            }
            rowSelection={rowSelection}
          />
        )}
      </div>

      {pagination && (
        <div className="data-table-pagination flex min-h-14 flex-wrap items-center justify-end gap-x-3 gap-y-1 border-t border-slate-100 px-3 py-2 sm:px-4 dark:border-zinc-700">
          <Pagination
            size="small"
            current={pagination.page}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={pagination.onChange}
            showSizeChanger
            pageSizeOptions={pagination.pageSizeOptions ?? DEFAULT_PAGE_SIZE_OPTIONS}
            showTotal={(total, [from, to]) => (
              <span className="text-xs text-slate-500 dark:text-zinc-400">
                {total === 0 ? "No results" : `${from}-${to} of ${total.toLocaleString()}`}
              </span>
            )}
          />
        </div>
      )}
    </section>
  );
}
