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
  return (
    <div className="flex md:justify-end flex-col gap-3 border-t border-slate-100 px-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-slate-700">
      <Pagination
        current={page}
        pageSize={pageSize}
        total={totalEntries}
        onChange={onPageChange}
        showSizeChanger={false}
        showLessItems
        itemRender={(pageNumber, type, originalElement) => {
          if (type === "page") {
            if (pageNumber === page || pageNumber === page + 1) {
              return originalElement;
            }

            return null;
          }

          if (type === "jump-prev" || type === "jump-next") {
            return null;
          }

          return originalElement;
        }}
        className="text-center sm:text-right"
      />
    </div>
  );
}
