import type { ReactNode } from "react";

import type { DashboardTrends } from "../../types/api-types";
import { BarChart, type BarDatum } from "./bar-chart";

const dayFormat = new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short" });
const fullDayFormat = new Intl.DateTimeFormat(undefined, {
  weekday: "short",
  day: "numeric",
  month: "short",
});

// "YYYY-MM-DD" is a local calendar date; parse it as local noon so it never shifts a day.
const parseLocalDate = (date: string) => new Date(`${date}T12:00:00`);

const formatHour = (hour: number) =>
  new Intl.DateTimeFormat(undefined, { hour: "numeric" }).format(new Date(2000, 0, 1, hour));

function ChartCard({
  title,
  subtitle,
  children,
  className = "",
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`min-w-0 rounded-xl border border-slate-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800 ${className}`}>
      <h3 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">{title}</h3>
      <p className="mb-4 text-xs text-slate-500 dark:text-zinc-400">{subtitle}</p>
      {children}
    </section>
  );
}

/** 30-day trends for admins: when visitors come, why, and to see whom. */
export function DashboardTrendsSection({ trends }: { trends: DashboardTrends }) {
  const byDay: BarDatum[] = trends.checkInsByDay.map(({ date, count }) => ({
    key: date,
    label: dayFormat.format(parseLocalDate(date)),
    fullLabel: fullDayFormat.format(parseLocalDate(date)),
    value: count,
  }));

  // Business hours carry the signal; the night is almost always empty.
  const byHour: BarDatum[] = trends.checkInsByHour
    .filter(({ hour, count }) => (hour >= 6 && hour <= 20) || count > 0)
    .map(({ hour, count }) => ({
      key: String(hour),
      label: formatHour(hour),
      fullLabel: `${formatHour(hour)} – ${formatHour((hour + 1) % 24)}`,
      value: count,
    }));

  const byPurpose: BarDatum[] = trends.visitsByPurpose.map(({ purpose, count }) => ({
    key: purpose,
    label: purpose,
    value: count,
  }));

  const byHost: BarDatum[] = trends.topHosts.map(({ hostName, count }) => ({
    key: hostName,
    label: hostName,
    value: count,
  }));

  const totalCheckIns = byDay.reduce((sum, day) => sum + day.value, 0);

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
      <ChartCard
        title="Check-ins per day"
        subtitle={`${totalCheckIns.toLocaleString()} in the last ${trends.days} days`}
        className="lg:col-span-2"
      >
        <BarChart
          title="Check-ins per day"
          unit="check-ins"
          data={byDay}
          labelEvery={5}
          emptyText={`No check-ins in the last ${trends.days} days.`}
        />
      </ChartCard>

      <ChartCard title="Busiest hours" subtitle="Check-ins by time of day, to plan front-desk cover">
        <BarChart
          title="Check-ins by hour"
          unit="check-ins"
          data={byHour}
          labelEvery={3}
          emptyText="No check-ins yet."
        />
      </ChartCard>

      <ChartCard title="Why people visit" subtitle="Visit requests by purpose">
        <BarChart
          title="Visit requests by purpose"
          unit="visits"
          orientation="bars"
          data={byPurpose}
          emptyText="No visit requests yet."
        />
      </ChartCard>

      <ChartCard
        title="Hosts with the most visitors"
        subtitle="Visit requests by host"
        className="lg:col-span-2"
      >
        <BarChart
          title="Visit requests by host"
          unit="visits"
          orientation="bars"
          data={byHost}
          emptyText="No visit requests yet."
        />
      </ChartCard>
    </div>
  );
}
