import { ClockCircleOutlined, WarningOutlined } from "@ant-design/icons";
import type { VisitorStatus } from "./visit-status-pill.tsx";
import type { ReactNode } from "react";


export type StatusFilter = "All" | VisitorStatus;
export type StatCard = {
  label: string;
  filter: StatusFilter;
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
};

export const statCards: StatCard[] = [
  {
    label: "Total Visitors",
    filter: "All",
    icon: <img src="/visitors2.svg" alt="" className="h-4 w-4" />,
    iconBg: "bg-blue-50 dark:bg-blue-500/10",
    iconColor: "text-blue-500 dark:text-blue-400",
  },
  {
    label: "Currently Signed In",
    filter: "Signed In",
    icon: <img src="/check.svg" alt="" className="h-4 w-4" />,
    iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
    iconColor: "text-emerald-500 dark:text-emerald-400",
  },
  {
    label: "Signed Off",
    filter: "Signed Off",
    icon: <img src="/back.svg" alt="" className="h-4 w-4" />,
    iconBg: "bg-slate-100 dark:bg-slate-700",
    iconColor: "text-slate-500 dark:text-slate-300",
  },
  {
    label: "Pending Approval",
    filter: "Pending",
    icon: <ClockCircleOutlined />,
    iconBg: "bg-orange-50 dark:bg-orange-500/10",
    iconColor: "text-orange-400 dark:text-orange-300",
  },
  {
    label: "Rejected",
    filter: "Rejected",
    icon: <WarningOutlined />,
    iconBg: "bg-rose-50 dark:bg-rose-500/10",
    iconColor: "text-rose-400 dark:text-rose-300",
  },
];