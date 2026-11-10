import type { ReactNode } from "react";

export type StatTone = "sky" | "amber" | "violet" | "rose" | "emerald" | "slate";

export interface StatCardItem<K extends string = string> {
  key: K;
  label: string;
  value: number | string;
  icon: ReactNode;
  tone?: StatTone;
}

interface StatCardsProps<K extends string> {
  items: StatCardItem<K>[];
  layout?: "default" | "four";
  /** The highlighted card. Defaults to the first one. */
  activeKey?: K;
  /** Makes the cards clickable, e.g. to filter the table below. */
  onSelect?: (key: K) => void;
}

const toneClasses: Record<StatTone, string> = {
  sky: "bg-sky-50 text-sky-500 dark:bg-sky-500/10 dark:text-sky-400",
  amber: "bg-amber-50 text-amber-500 dark:bg-amber-500/10 dark:text-amber-400",
  violet: "bg-violet-50 text-violet-500 dark:bg-violet-500/10 dark:text-violet-400",
  rose: "bg-rose-50 text-rose-500 dark:bg-rose-500/10 dark:text-rose-400",
  emerald: "bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10 dark:text-emerald-400",
  slate: "bg-slate-100 text-slate-500 dark:bg-zinc-700 dark:text-zinc-300",
};

const MOBILE_MAX_CARDS = 3;

/** A row of headline numbers; the active card is filled with the brand colour. */
export function StatCards<K extends string>({
  items,
  layout = "default",
  activeKey,
  onSelect,
}: StatCardsProps<K>) {
  const highlighted = activeKey ?? items[0]?.key;
  const gridClassName =
    layout === "four"
      ? "grid grid-cols-2 gap-2 lg:grid-cols-4"
      : "grid grid-cols-3 gap-2 xl:grid-cols-[repeat(auto-fit,minmax(160px,1fr))]";

  return (
    <div className={gridClassName}>
      {items.map((item, index) => {
        const isActive = item.key === highlighted;
        const content = (
          <>
            <span className="min-w-0">
              <span
                className={`block text-base leading-tight font-bold sm:text-lg ${
                  isActive ? "text-white" : "text-slate-900 dark:text-zinc-100"
                }`}
              >
                {typeof item.value === "number" ? item.value.toLocaleString() : item.value}
              </span>
              <span
                className={`line-clamp-2 block text-[11px] leading-snug sm:truncate sm:text-xs ${
                  isActive ? "text-sky-50" : "text-slate-500 dark:text-zinc-400"
                }`}
              >
                {item.label}
              </span>
            </span>

            <span
              className={`hidden h-9 w-9 shrink-0 items-center justify-center rounded-full sm:flex ${
                isActive ? "bg-white/20 text-white" : toneClasses[item.tone ?? "slate"]
              }`}
            >
              {item.icon}
            </span>
          </>
        );

        // Phones show at most one row of three.
        const className = `${layout === "default" && index >= MOBILE_MAX_CARDS ? "max-sm:hidden" : ""} flex min-w-0 items-center justify-between gap-3 rounded-xl border p-2 text-left sm:p-3 transition-colors ${
          isActive
            ? "border-sky-500 bg-sky-500"
            : "border-slate-200 bg-white dark:border-zinc-700 dark:bg-zinc-800"
        }`;

        return onSelect ? (
          <button
            key={item.key}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelect(item.key)}
            title={`Show ${item.label.toLowerCase()}`}
            className={`${className} cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 active:scale-[0.98] dark:focus-visible:ring-offset-zinc-900 ${
              isActive ? "" : "hover:border-sky-300 dark:hover:border-sky-700"
            }`}
          >
            {content}
          </button>
        ) : (
          <div key={item.key} className={className}>
            {content}
          </div>
        );
      })}
    </div>
  );
}
