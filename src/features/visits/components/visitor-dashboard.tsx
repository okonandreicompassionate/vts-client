import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { QrcodeOutlined } from "@ant-design/icons";
import VisitorQrModal from "@/components/visitor-qr/visitor-qr-modal";
import {
  CalendarOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  CloseOutlined,
  EyeOutlined,
  LoginOutlined,
  LogoutOutlined,
  WarningOutlined,
} from "@ant-design/icons";

import { PageShell, StatCards, type StatCardItem, RefreshButton } from "@/components/page";
import { RowActions } from "@/components/ui/row-actions";
import { Spinner } from "@/components/ui/spinner";
import { paths } from "@/config/paths";
import { VISIT_TIME_ZONE, visitDateKey } from "@/utils/visit-time";
import { useAdminAuthSession } from "@/features/auth/hooks/use-auth-session";
import { usePopup } from "@/lib/contexts/popup/use-popup";
import { hasRole, type UserRole } from "@/types/user-role";
import { useGetDashboardQuery } from "../api/admins-visit-api-slice";
import { useVisitorCheckActions } from "../hooks/use-visitor-check-actions";
import type { DashboardVisit, VisitRecord } from "../types/api-types";
import { toVisitorRow } from "../utils/visits";
import { DashboardTrendsSection } from "./dashboard/dashboard-trends";
import { VisitListPanel } from "./dashboard/visit-list-panel";
import VisitorDetailsDrawer from "./drawers/visitor-details-drawer";
import RejectAppointmentModal from "./modals/reject-appointment-modal";

type CardKey = "approval" | "arriving" | "onSite" | "overstayed" | "checkedOut";

// Matches the server: only these roles may check visitors in and out.
const GATE_ROLES: UserRole[] = ["SUPERADMIN", "ADMIN", "SECURITY", "FRONTDESK"];
const PANEL_ID: Record<Exclude<CardKey, "checkedOut">, string> = {
  approval: "dashboard-approval",
  arriving: "dashboard-arriving",
  onSite: "dashboard-on-site",
  overstayed: "dashboard-on-site",
};

const scheduleFormat = new Intl.DateTimeFormat(undefined, {
  timeZone: VISIT_TIME_ZONE,
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const formatDateTime = (value: string | null) =>
  value ? scheduleFormat.format(new Date(value)) : "?";

function formatDuration(since: string | null) {
  if (!since) return "";
  const minutes = Math.max(0, Math.round((Date.now() - new Date(since).getTime()) / 60_000));
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ${minutes % 60}m`;
  const days = Math.floor(hours / 24);
  return `${days}d ${hours % 24}h`;
}

const toRow = (visit: DashboardVisit) => toVisitorRow(visit as unknown as VisitRecord, 0);

/** "Today" follows the organization's Lagos calendar, including midnight rollover. */
function useLocalDay() {
  const [todayKey, setTodayKey] = useState(() => visitDateKey(new Date()));

  useEffect(() => {
    const timer = window.setInterval(() => setTodayKey(visitDateKey(new Date())), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return useMemo(
    () => ({
      dayStart: new Date(`${todayKey}T00:00:00+01:00`).toISOString(),
      timeZone: VISIT_TIME_ZONE,
    }),
    [todayKey],
  );
}

function VisitRowLayout({
  visit,
  meta,
  actions,
  onOpen,
}: {
  visit: DashboardVisit;
  meta: ReactNode;
  actions?: ReactNode;
  onOpen: () => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen();
        }
      }}
      className="flex cursor-pointer items-center gap-3 px-4 py-2.5 transition-colors hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:outline-none dark:hover:bg-zinc-700/40 dark:focus-visible:bg-zinc-700/40"
    >
      <div className="min-w-0 flex-1 text-left">
        <div className="flex flex-col items-start gap-1">
          <span className="w-full truncate text-sm font-medium text-slate-900 dark:text-zinc-100">
            {visit.name}
          </span>
          <span className="text-xs text-slate-500 tabular-nums dark:text-zinc-400">{meta}</span>
        </div>
      </div>

      {actions && (
        <span
          className="flex shrink-0 gap-1.5"
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
        >
          {actions}
        </span>
      )}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: currentUser } = useAdminAuthSession();
  const role = currentUser?.role;
  const canCheckInOut = hasRole(role, GATE_ROLES);
  // Front desk only sees visitors once they're inside, so arrivals would always be empty.
  const seesArrivals = role !== "FRONTDESK";

  const { openDrawer, openModal } = usePopup();
  const {
    confirmApprove,
    confirmCheckIn,
    confirmCheckOut,
    isApproving,
    isCheckingIn,
    isCheckingOut,
  } = useVisitorCheckActions();

  const day = useLocalDay();
  const { data, isLoading, isFetching, isError, refetch } = useGetDashboardQuery(day, {
    pollingInterval: 30_000,
  });

  const canReview = data?.needsApproval != null;
  const [activeCard, setActiveCard] = useState<CardKey | null>(null);
  const [highlightedPanel, setHighlightedPanel] = useState<string | null>(null);

  useEffect(() => {
    if (!highlightedPanel) return;
    const timer = window.setTimeout(() => setHighlightedPanel(null), 1500);
    return () => window.clearTimeout(timer);
  }, [highlightedPanel]);

  const openVisitor = (visit: DashboardVisit) =>
    openDrawer(<VisitorDetailsDrawer visitorId={visit.id} />);

  const handleCardSelect = (key: CardKey) => {
    setActiveCard(key);

    if (key === "checkedOut") {
      navigate(paths.admin.visitors.getHref());
      return;
    }

    const panelId = PANEL_ID[key];
    const panel = document.getElementById(panelId);
    const content = panel?.closest<HTMLElement>("[data-dashboard-scroll]");
    if (panel && content) {
      content.scrollTo({
        top:
          content.scrollTop +
          panel.getBoundingClientRect().top -
          content.getBoundingClientRect().top,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    }
    setHighlightedPanel(panelId);
  };

  const summary = data?.summary;
  const cards: StatCardItem<CardKey>[] = summary
    ? [
        ...(canReview
          ? [
              {
                key: "approval" as const,
                label: summary.oldestPendingAt
                  ? `Awaiting approval · oldest ${formatDuration(summary.oldestPendingAt)}`
                  : "Awaiting approval",
                value: summary.awaitingApproval ?? 0,
                icon: <ClockCircleOutlined />,
                tone: "amber" as const,
              },
            ]
          : []),
        ...(seesArrivals
          ? [
              {
                key: "arriving" as const,
                label: "Expected today",
                value: summary.expected,
                icon: <CalendarOutlined />,
                tone: "sky" as const,
              },
            ]
          : []),
        {
          key: "onSite",
          label: "On site now",
          value: summary.onSite,
          icon: <LoginOutlined />,
          tone: "emerald",
        },
        {
          key: "overstayed",
          label: "Overstayed",
          value: summary.overstayed,
          icon: <WarningOutlined />,
          tone: "rose",
        },
        {
          key: "checkedOut",
          label: "Checked out today",
          value: summary.checkedOutToday,
          icon: <LogoutOutlined />,
          tone: "slate",
        },
      ]
    : [];

  const viewAllLink = (label: string, href: string) => (
    <Button type="link" size="small" className="px-0!" onClick={() => navigate(href)}>
      {label}
    </Button>
  );

  const visitActions = (visit: DashboardVisit) => (
    <RowActions
      label={visit.name + " " + visit.referenceId}
      primary={
        visit.status === "PENDING" && canReview
          ? [
              {
                key: "approve",
                label: "Approve",
                icon: <CheckOutlined />,
                disabled: isApproving,
                onSelect: () => confirmApprove(toRow(visit)),
              },
              {
                key: "reject",
                label: "Reject",
                icon: <CloseOutlined />,
                danger: true,
                disabled: isApproving,
                onSelect: () => openModal(<RejectAppointmentModal appointment={toRow(visit)} />),
              },
            ]
          : visit.status === "APPROVED" && canCheckInOut
            ? [
                {
                  key: "check-in",
                  label: "Check In",
                  icon: <LoginOutlined />,
                  disabled: isCheckingIn,
                  onSelect: () => confirmCheckIn(toRow(visit)),
                },
              ]
            : visit.status === "CHECKED_IN" && canCheckInOut
              ? [
                  {
                    key: "check-out",
                    label: "Check Out",
                    icon: <LogoutOutlined />,
                    disabled: isCheckingOut,
                    onSelect: () => confirmCheckOut(toRow(visit)),
                  },
                ]
              : []
      }
      secondary={[
        {
          key: "view",
          label: "View Details",
          icon: <EyeOutlined />,
          onSelect: () => openVisitor(visit),
        },
      ]}
    />
  );

  const approvalPanel = data?.needsApproval && summary && (
    <VisitListPanel
      key="approval"
      id={PANEL_ID.approval}
      title="Pending approval"
      total={summary.awaitingApproval ?? 0}
      items={data.needsApproval}
      highlighted={highlightedPanel === PANEL_ID.approval}
      empty="Nothing waiting for approval."
      footer={viewAllLink("View all in Appointments", paths.admin.appointments.getHref())}
      renderItem={(visit) => (
        <VisitRowLayout
          visit={visit}
          onOpen={() => openVisitor(visit)}
          meta={formatDateTime(visit.registeredAt)}
          actions={visitActions(visit)}
        />
      )}
    />
  );

  const arrivingPanel = seesArrivals && data && summary && (
    <VisitListPanel
      key="arriving"
      id={PANEL_ID.arriving}
      title="Arriving today"
      total={summary.expected}
      items={data.arrivingToday}
      highlighted={highlightedPanel === PANEL_ID.arriving}
      empty="No more visitors expected today."
      footer={viewAllLink("View all in Visitors", paths.admin.visitors.getHref())}
      renderItem={(visit) => (
        <VisitRowLayout
          visit={visit}
          onOpen={() => openVisitor(visit)}
          meta={formatDateTime(visit.scheduledAt ?? visit.registeredAt)}
          actions={visitActions(visit)}
        />
      )}
    />
  );

  const onSitePanel = data && summary && (
    <VisitListPanel
      key="onSite"
      id={PANEL_ID.onSite}
      title="On site now"
      total={summary.onSite}
      items={data.onSite}
      highlighted={highlightedPanel === PANEL_ID.onSite}
      empty="Nobody is checked in right now."
      footer={viewAllLink("View all in Visitors", paths.admin.visitors.getHref())}
      renderItem={(visit) => (
        <VisitRowLayout
          visit={visit}
          onOpen={() => openVisitor(visit)}
          meta={formatDateTime(visit.checkInTime)}
          actions={visitActions(visit)}
        />
      )}
    />
  );

  const panels = [approvalPanel, arrivingPanel, onSitePanel].filter(Boolean);

  return (
    <PageShell
      title="Dashboard"
      description="Today's work, and who's on site right now."
      actions={
        <>
          <RefreshButton loading={isFetching} onClick={() => void refetch()} />
          <Button icon={<QrcodeOutlined />} onClick={() => openModal(<VisitorQrModal />)}>
            Visitor QR
          </Button>
        </>
      }
    >
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center py-20">
          <Spinner label="Loading dashboard" />
        </div>
      ) : isError || !data ? (
        <div role="alert" className="flex flex-col items-center gap-2 py-20 text-center">
          <p className="text-sm text-rose-600 dark:text-rose-400">
            The dashboard could not be loaded.
          </p>
          <Button size="small" onClick={() => void refetch()}>
            Retry
          </Button>
        </div>
      ) : (
        <>
          <StatCards<CardKey>
            items={cards}
            activeKey={activeCard ?? cards[0]?.key}
            onSelect={handleCardSelect}
          />

          <div
            className={`grid grid-cols-1 gap-3 ${panels.length === 3 ? "xl:grid-cols-3" : "lg:grid-cols-2"}`}
          >
            {panels}
          </div>

          {data.trends && (
            <section
              aria-labelledby="dashboard-trends-title"
              className="flex min-w-0 flex-col gap-3"
            >
              <h2
                id="dashboard-trends-title"
                className="text-sm font-semibold text-slate-900 dark:text-zinc-100"
              >
                Last {data.trends.days} days
              </h2>
              <DashboardTrendsSection trends={data.trends} />
            </section>
          )}
        </>
      )}
    </PageShell>
  );
}
