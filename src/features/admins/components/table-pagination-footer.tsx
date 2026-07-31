import { Pagination } from "antd";

interface TablePaginationFooterProps {
  page: number;
  pageSize: number;
  totalEntries: number;
  onPageChange: (page: number) => void;
}

export function TablePaginationFooter({
  page,
  pageSize,
  totalEntries,
  onPageChange,
}: TablePaginationFooterProps) {
  const startEntry = totalEntries === 0 ? 0 : Math.min((page - 1) * pageSize + 1, totalEntries);
  const endEntry = Math.min(page * pageSize, totalEntries);

  return (
    <div className="flex flex-col gap-3 border-t border-slate-100 px-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <p className="text-center text-sm text-slate-400 sm:text-left">
        Showing {startEntry} to {endEntry} of {totalEntries} entries
      </p>
      <Pagination
        current={page}
        pageSize={pageSize}
        total={totalEntries}
        onChange={onPageChange}
        showSizeChanger={false}
        className="text-center sm:text-right"
      />
    </div>
  );
}
