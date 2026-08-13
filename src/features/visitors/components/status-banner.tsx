import { Tag } from "antd";
import type { StatusMeta } from "../types/pill-status-meta";

type Props = {
  meta: StatusMeta;
  status: string;
};

export default function StatusBanner({ meta, status }: Props) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between lg:p-6 dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-full shadow-sm ${meta.iconWrapBg}`}
        >
          {meta.desktopIcon}
        </div>
        <div>
          <p className="text-base font-bold text-slate-900 dark:text-slate-100">{meta.title}</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{meta.description}</p>
        </div>
      </div>

      <Tag
        className="rounded-full border-0 px-4 py-1.5 text-sm font-semibold"
        color={
          meta.badgeColor === "bg-orange-50 text-orange-600"
            ? "orange"
            : meta.badgeColor === "bg-emerald-50 text-emerald-600"
              ? "green"
              : "red"
        }
      >
        {status === "pending"
          ? "Pending approval"
          : status === "approved"
            ? "Approved"
            : "Rejected"}
      </Tag>
    </div>
  );
}
