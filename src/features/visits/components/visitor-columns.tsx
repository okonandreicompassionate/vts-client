import type { ColumnType, ColumnsType } from "antd/es/table";
import type { ReactNode } from "react";

import { RowActions } from "@/components/ui/row-actions";
import type { VisitorRow } from "../utils/visits";
import { getVisitorRowActions } from "../utils/visitor-row-actions";
import StatusPill from "./visit-status-pill";
import HostDecisionTag from "./host-decision-tag";
import { VisitDateTimeCell } from "./visitor-table-cells";

type VisitorColumn = ColumnType<VisitorRow>;

const textCell = (value?: string | null) => (
  <span
    className="block truncate text-xs text-slate-600 dark:text-zinc-300"
    title={value ?? undefined}
  >
    {value || "—"}
  </span>
);

const timeCell = (value?: string | null) => (
  <span className="text-xs whitespace-nowrap text-slate-700 dark:text-zinc-200">
    {value && value !== "Pending" ? value : "—"}
  </span>
);

/**
 * Shared visit-table columns, so every list renders a field the same way.
 * Pages pick the ones that matter to them.
 */
export const visitorColumns = {
  /** Name, with the email or (at the gate) the phone underneath. */
  visitor: (detail: "email" | "phone" = "email", showReference = true): VisitorColumn => ({
    title: "Visitor",
    dataIndex: "name",
    key: "visitor",
    render: (_name, visitor) => (
      <div className="flex min-w-32 flex-col">
        <span className="truncate text-xs font-medium text-slate-800 dark:text-zinc-100">
          {visitor.name}
        </span>
        <span className="truncate text-[11px] text-slate-400">{visitor[detail]}</span>
        {showReference && visitor.referenceId && (
          <span className="truncate text-[11px] text-slate-500 dark:text-zinc-400">
            {visitor.referenceId}
          </span>
        )}
      </div>
    ),
  }),

  visitId: (): VisitorColumn => ({
    title: "Visit ID",
    dataIndex: "referenceId",
    key: "visit-id",
    render: textCell,
  }),

  host: (): VisitorColumn => ({
    title: "Host",
    dataIndex: "host",
    key: "host",
    render: textCell,
  }),

  purpose: (): VisitorColumn => ({
    title: "Purpose",
    dataIndex: "purpose",
    key: "purpose",
    render: textCell,
  }),

  /** When the visit is booked for; walk-ins fall back to when they arrived or registered. */
  visitDate: (): VisitorColumn => ({
    title: "Visit Date",
    key: "visit-date",
    render: (_value, visitor) => (
      <VisitDateTimeCell
        time={visitor.requestedTime ?? visitor.visitTime}
        date={visitor.requestedDate ?? visitor.visitDate}
      />
    ),
  }),

  status: (): VisitorColumn => ({
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status: VisitorRow["status"], visitor) => (
      <div className="flex flex-col items-start gap-0.5">
        <StatusPill status={status} />
        <HostDecisionTag decision={visitor.hostDecision} status={status} />
      </div>
    ),
  }),

  checkIn: (): VisitorColumn => ({
    title: "Check-In",
    dataIndex: "checkIn",
    key: "check-in",
    render: timeCell,
  }),

  checkOut: (): VisitorColumn => ({
    title: "Check-Out",
    dataIndex: "checkOut",
    key: "check-out",
    render: timeCell,
  }),

  actions: (render: (visitor: VisitorRow) => ReactNode): VisitorColumn => ({
    title: "Action",
    key: "action",
    align: "center",
    render: (_value, visitor) => render(visitor),
  }),
};

/** Status-dependent columns: no point showing a status, or times, every row lacks. */
export function statusColumns({
  showStatus,
  showCheckIn,
  showCheckOut,
}: {
  showStatus: boolean;
  showCheckIn: boolean;
  showCheckOut: boolean;
}): ColumnsType<VisitorRow> {
  return [
    ...(showStatus ? [visitorColumns.status()] : []),
    ...(showCheckIn ? [visitorColumns.checkIn()] : []),
    ...(showCheckOut ? [visitorColumns.checkOut()] : []),
  ];
}

export function getFacilityVisitorColumns(
  status: "ALL" | "APPROVED" | "SIGNED_IN" | "SIGNED_OFF",
  actionHandlers: Parameters<typeof getVisitorRowActions>[1],
): ColumnsType<VisitorRow> {
  return [
    visitorColumns.visitor(),
    visitorColumns.host(),
    visitorColumns.purpose(),
    visitorColumns.visitDate(),
    // A single-status view implies the status; only "ALL" needs the pill.
    ...statusColumns({
      showStatus: status === "ALL",
      showCheckIn: status !== "APPROVED",
      showCheckOut: status === "ALL" || status === "SIGNED_OFF",
    }),
    visitorColumns.actions((visitor) => (
      <RowActions label={visitor.name} {...getVisitorRowActions(visitor, actionHandlers)} />
    )),
  ];
}
