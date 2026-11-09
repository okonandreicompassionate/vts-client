import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { ReactNode } from "react";

interface FilterBarProps {
  search?: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  };
  /** Filter controls (Selects, date pickers…), laid out in an even grid beside the search. */
  children?: ReactNode;
}

/** Search box plus filters, shown above a page's stats and table. */
export function FilterBar({ search, children }: FilterBarProps) {
  return (
    <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
      {search && (
        <Input
          allowClear
          value={search.value}
          onChange={(event) => search.onChange(event.target.value)}
          prefix={<SearchOutlined className="text-slate-400 dark:text-zinc-500" />}
          placeholder={search.placeholder ?? "Search"}
          className="lg:flex-1"
        />
      )}

      {children && (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:flex-none lg:[&>*]:w-48">
          {children}
        </div>
      )}
    </div>
  );
}
