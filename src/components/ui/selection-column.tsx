import { Checkbox } from "antd";
import type { ColumnType } from "antd/es/table";

interface SelectionColumnParams<T> {
  selectedRowKeys: React.Key[];
  onToggle: (record: T) => void;
  checkboxClassName?: string;
}

export function getSelectionColumn<T extends { id: string }>({
  selectedRowKeys,
  onToggle,
  checkboxClassName,
}: SelectionColumnParams<T>): ColumnType<T> {
  return {
    title: "",
    key: "selection",
    width: 32,
    align: "center",
    render: (_value: unknown, record: T) => (
      <Checkbox
        checked={selectedRowKeys.includes(record.id)}
        onChange={() => onToggle(record)}
        onClick={(event) => event.stopPropagation()}
        className={checkboxClassName}
      />
    ),
  };
}
