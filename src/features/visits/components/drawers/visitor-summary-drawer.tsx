import { LoginOutlined, LogoutOutlined } from "@ant-design/icons";

import type { RowAction } from "@/components/ui/row-actions";
import CustomDrawer from "@/components/ui/custom-drawer";
import { usePopup } from "@/lib/contexts/popup/use-popup";
import type { VisitorRow } from "../../utils/visits";
import { useVisitorCheckActions } from "../../hooks/use-visitor-check-actions";

const FIELDS = {
  phone: ["Phone Number", (visitor: VisitorRow) => visitor.phone],
  host: ["Host", (visitor: VisitorRow) => visitor.host],
  purpose: ["Purpose", (visitor: VisitorRow) => visitor.purpose],
  status: ["Status", (visitor: VisitorRow) => visitor.status],
  visitDate: ["Visit Date", (visitor: VisitorRow) => visitor.time],
  checkIn: ["Check-in Time", (visitor: VisitorRow) => visitor.checkIn],
  checkOut: ["Check-out Time", (visitor: VisitorRow) => visitor.checkOut],
} as const;

export type VisitorSummaryField = keyof typeof FIELDS;

interface VisitorSummaryDrawerProps {
  visitor: VisitorRow;
  fields?: VisitorSummaryField[];
  /** Show "Check In Visitor" for approved visitors. */
  allowCheckIn?: boolean;
  /** Show "Check Out Visitor" for visitors who are signed in. */
  allowCheckOut?: boolean;
}

/**
 * Quick visitor summary for the gate staff screens; check-in/out is in the header menu.
 * Open with `openDrawer(<VisitorSummaryDrawer visitor={row} />)`.
 */
export default function VisitorSummaryDrawer({
  visitor,
  fields = ["phone", "host", "purpose", "status", "checkIn"],
  allowCheckIn = false,
  allowCheckOut = false,
}: VisitorSummaryDrawerProps) {
  const { closeDrawer } = usePopup();
  const { confirmCheckIn, confirmCheckOut } = useVisitorCheckActions();

  // The drawer shows the visitor's old status once an action succeeds.
  const actionOptions = { onDone: closeDrawer };

  const primary: RowAction[] = [
    ...(allowCheckIn && visitor.status === "Approved"
      ? [
          {
            key: "check-in",
            label: "Check In",
            icon: <LoginOutlined />,
            onSelect: () => confirmCheckIn(visitor, actionOptions),
          },
        ]
      : []),
    ...(allowCheckOut && visitor.status === "Signed In"
      ? [
          {
            key: "check-out",
            label: "Check Out",
            icon: <LogoutOutlined />,
            onSelect: () => confirmCheckOut(visitor, actionOptions),
          },
        ]
      : []),
  ];

  return (
    <CustomDrawer
      title="Visitor Details"
      width="min(100vw, 420px)"
      actionsLabel={visitor.name}
      actions={{ primary }}
    >
      <div className="space-y-4">
        <div className="rounded-lg border border-slate-100 dark:border-zinc-700">
          <div className="border-b border-slate-100 px-4 py-3 dark:border-zinc-700">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">
              {visitor.name}
            </h2>
            <p className="mt-1 text-xs text-slate-500">{visitor.email}</p>
          </div>
          <dl className="divide-y divide-slate-100 dark:divide-zinc-700">
            {fields.map((field) => {
              const [label, read] = FIELDS[field];

              return (
                <div key={field} className="grid grid-cols-[7rem_minmax(0,1fr)] gap-3 px-4 py-3">
                  <dt className="text-xs text-slate-500">{label}</dt>
                  <dd className="text-xs text-slate-800 dark:text-zinc-100">{read(visitor)}</dd>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </CustomDrawer>
  );
}
