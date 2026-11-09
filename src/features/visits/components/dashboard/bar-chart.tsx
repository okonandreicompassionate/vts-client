import { Tooltip } from "antd";

export interface BarDatum {
  key: string;
  /** Axis / row label. */
  label: string;
  /** Longer label for the tooltip and table, e.g. a full date. */
  fullLabel?: string;
  value: number;
}

interface BarChartProps {
  data: BarDatum[];
  /** What a value counts, e.g. "check-ins". */
  unit: string;
  /** Names the chart for screen readers and the table caption. */
  title: string;
  /** Columns grow up from a baseline; bars grow right from a label column. */
  orientation?: "columns" | "bars";
  /** Show every nth axis label so they don't collide. */
  labelEvery?: number;
  emptyText?: string;
}

// sky-600: passes 3:1 on the light (white) and dark (zinc-800) card surfaces.
const BAR_COLOR = "bg-sky-600";

const tooltipText = (datum: BarDatum, unit: string) =>
  `${datum.value.toLocaleString()} ${unit} · ${datum.fullLabel ?? datum.label}`;

/** Single-series bar chart: one hue, no legend, peak labelled, every value in the tooltip and table. */
export function BarChart({
  data,
  unit,
  title,
  orientation = "columns",
  labelEvery = 1,
  emptyText = "No data yet.",
}: BarChartProps) {
  const max = Math.max(0, ...data.map((datum) => datum.value));

  if (max === 0) {
    return (
      <p className="flex h-40 items-center justify-center text-xs text-slate-400 dark:text-zinc-500">
        {emptyText}
      </p>
    );
  }

  const peakKey = data.find((datum) => datum.value === max)?.key;
  const table = (
    <table className="sr-only">
      <caption>{title}</caption>
      <thead>
        <tr>
          <th scope="col">Label</th>
          <th scope="col">{unit}</th>
        </tr>
      </thead>
      <tbody>
        {data.map((datum) => (
          <tr key={datum.key}>
            <th scope="row">{datum.fullLabel ?? datum.label}</th>
            <td>{datum.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  if (orientation === "bars") {
    return (
      <div>
        <ul aria-hidden className="flex flex-col gap-2.5">
          {data.map((datum) => (
            <Tooltip key={datum.key} title={tooltipText(datum, unit)} placement="topLeft">
              <li className="grid grid-cols-[minmax(0,9rem)_1fr_auto] items-center gap-3 text-xs">
                <span className="truncate text-slate-600 dark:text-zinc-300">{datum.label}</span>
                <span className="h-3 rounded-r-[4px] bg-slate-100 dark:bg-zinc-700/60">
                  <span
                    className={`block h-full rounded-r-[4px] ${BAR_COLOR}`}
                    style={{ width: `${(datum.value / max) * 100}%` }}
                  />
                </span>
                <span className="font-medium text-slate-700 tabular-nums dark:text-zinc-200">
                  {datum.value.toLocaleString()}
                </span>
              </li>
            </Tooltip>
          ))}
        </ul>
        {table}
      </div>
    );
  }

  return (
    <div>
      <div aria-hidden className="flex h-40 items-end gap-[2px] border-b pt-4 border-slate-200 dark:border-zinc-700">
        {data.map((datum) => (
          <Tooltip key={datum.key} title={tooltipText(datum, unit)}>
            {/* The whole column slot is the hit target, not just the bar. */}
            <div className="group relative flex h-full min-w-0 flex-1 items-end justify-center">
              {datum.key === peakKey && (
                <span
                  className="absolute left-1/2 -translate-x-1/2 text-[10px] font-semibold text-slate-700 tabular-nums dark:text-zinc-200"
                  style={{ bottom: `calc(${(datum.value / max) * 100}% + 2px)` }}
                >
                  {datum.value.toLocaleString()}
                </span>
              )}
              <div
                className={`w-full max-w-6 rounded-t-[4px] transition-opacity group-hover:opacity-80 ${BAR_COLOR}`}
                style={{ height: `${(datum.value / max) * 100}%`, minHeight: datum.value ? 2 : 0 }}
              />
            </div>
          </Tooltip>
        ))}
      </div>

      <div aria-hidden className="mt-1 flex gap-[2px]">
        {data.map((datum, index) => (
          <span
            key={datum.key}
            className="min-w-0 flex-1 overflow-visible text-center text-[10px] whitespace-nowrap text-slate-400 dark:text-zinc-500"
          >
            {index % labelEvery === 0 ? datum.label : ""}
          </span>
        ))}
      </div>
      {table}
    </div>
  );
}
