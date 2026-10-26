import type { ColumnsType } from "antd/es/table";
import { Button } from "antd";
import { EyeOutlined, LoginOutlined, LogoutOutlined } from "@ant-design/icons";

import type { VisitorRow } from "../utils/visits";
import { VisitorIdentityCell, VisitDateTimeCell } from "./visitor-table-cells";
import StatusPill from "./visit-status-pill";
import { VisitorCheckoutTime } from "./visitor-checkout-time";

export function getVisitorColumns(
  onViewVisitor?: (visitor: VisitorRow) => void,
): ColumnsType<VisitorRow> {
  return [
    {
      title: "Visitor Details",
      dataIndex: "name",
      key: "name",
      render: (_, record) => <VisitorIdentityCell name={record.name} phone={record.phone} />,
    },
    {
      title: "Host Name",
      dataIndex: "host",
      key: "host",
      render: (host) => <span className="text-xs text-slate-600 dark:text-slate-300">{host}</span>,
    },
    {
      title: "Purpose",
      dataIndex: "purpose",
      key: "purpose",
      render: (purpose) => (
        <span className="text-xs text-slate-600 dark:text-slate-300">{purpose}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <StatusPill status={status} />,
    },
    {
      title: "Check-In Time",
      dataIndex: "checkIn",
      key: "checkIn",
      render: (_, record) => (
        <VisitDateTimeCell date={record.checkInDate} time={record.checkInTime} />
      ),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Button
          type="text"
          size="small"
          shape="circle"
          icon={<EyeOutlined />}
          aria-label="View visitor"
          onClick={(event) => {
            event.stopPropagation();
            onViewVisitor?.(record);
          }}
          className="text-sky-500! hover:bg-sky-100! dark:bg-sky-500/10! dark:text-sky-400! dark:hover:bg-sky-500/20!"
        />
      ),
    },
  ];
}

export function getFacilityVisitorColumns(
  onVisitorAction?: (visitor: VisitorRow) => void,
  isActionLoading = false,
): ColumnsType<VisitorRow> {
  return [
    {
      title: "Visitor Name",
      dataIndex: "name",
      key: "name",
      render: (_, visitor) => (
        <div className="flex min-w-32 flex-col">
          <span className="text-xs font-medium text-slate-800 dark:text-slate-100">
            {visitor.name}
          </span>
          <span className="text-[11px] text-slate-400">{visitor.email}</span>
        </div>
      ),
    },
    {
      title: "Registered",
      dataIndex: "time",
      key: "registered",
      render: (time: string) => (
        <span className="text-xs text-slate-700 dark:text-slate-200">{time}</span>
      ),
    },
    {
      title: "Purpose",
      dataIndex: "purpose",
      key: "purpose",
      render: (purpose: string) => (
        <span className="text-xs text-slate-600 dark:text-slate-300">{purpose}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: VisitorRow["status"]) => <StatusPill status={status} />,
    },
    {
      title: "Check-In Time",
      dataIndex: "checkIn",
      key: "checkIn",
      render: (time: string) => (
        <span className="text-xs text-slate-700 dark:text-slate-200">{time}</span>
      ),
    },
    {
      title: "Check-Out Time",
      dataIndex: "checkOut",
      key: "checkOut",
      render: (_time: string, visitor) => (
        <span className="text-xs text-slate-700 dark:text-slate-200">
          <VisitorCheckoutTime visitor={visitor} />
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, visitor) => (
        <Button
          type="link"
          size="small"
          icon={getVisitorActionIcon(visitor.status)}
          loading={isActionLoading}
          aria-label={`${getVisitorActionLabel(visitor.status)} ${visitor.name}`}
          onClick={(event) => {
            event.stopPropagation();
            onVisitorAction?.(visitor);
          }}
          className="text-sky-500! dark:text-sky-400!"
        >
          {getVisitorActionLabel(visitor.status)}
        </Button>
      ),
    },
  ];
}

function getVisitorActionLabel(status: VisitorRow["status"]) {
  switch (status) {
    case "Pending":
      return "Review";
    case "Approved":
      return "Check In";
    case "Signed In":
      return "Check Out";
    case "Signed Off":
    case "Rejected":
      return "View";
  }
}

function getVisitorActionIcon(status: VisitorRow["status"]) {
  if (status === "Approved") return <LoginOutlined />;
  if (status === "Signed In") return <LogoutOutlined />;
  return <EyeOutlined />;
}

export const visitorColumns = getVisitorColumns();
