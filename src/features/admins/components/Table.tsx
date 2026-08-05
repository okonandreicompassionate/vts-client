import { Table } from "antd";
import type { ColumnsType, TablePaginationConfig, TableProps } from "antd/es/table";

type TableComponentProps<T extends object> = {
  columns: ColumnsType<T>;
  dataSource: T[];
  rowKey?: keyof T | ((record: T) => string | number);
  pagination?: boolean | TablePaginationConfig;
  scroll?: { x?: number; y?: number };
  className?: string;
  size?: "small" | "middle" | "large";
  showSerialNumber?: boolean;
  serialNumberTitle?: string;
  startIndex?: number;
  onRow?: TableProps<T>["onRow"];
};

function TableComponent<T extends object>({
  columns,
  dataSource,
  rowKey,
  pagination = false,
  scroll = { x: 700 },
  className,
  size = "small",
  showSerialNumber = false,
  serialNumberTitle = "SN",
  startIndex = 1,
  onRow,
}: TableComponentProps<T>) {
  const finalColumns = showSerialNumber
    ? [
        {
          title: serialNumberTitle,
          key: "__serial",
          width: 54,
          align: "center" as const,
          render: (_value: unknown, _record: T, index: number) => (
            <span className="text-sm text-slate-500 dark:text-slate-400">{startIndex + index}</span>
          ),
        },
        ...columns,
      ]
    : columns;

  return (
    <div className="overflow-x-auto">
      <Table<T>
        columns={finalColumns}
        dataSource={dataSource}
        size={size}
        pagination={pagination === true ? undefined : pagination}
        rowKey={rowKey}
        scroll={scroll}
        className={className}
        onRow={onRow}
      />
    </div>
  );
}

export default TableComponent;
