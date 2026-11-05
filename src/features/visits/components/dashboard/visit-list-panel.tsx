import type { ReactNode } from "react";

interface VisitListPanelProps<T extends { id: string }> {
  /** Anchor the matching stat card scrolls to. */
  id: string;
  title: string;
  /** Full count; the list itself shows at most the first few. */
  total: number;
  items: T[];
  renderItem: (item: T) => ReactNode;
  empty: string;
  /** Briefly outlined after its stat card is clicked. */
  highlighted?: boolean;
  footer?: ReactNode;
}

/** A dashboard card listing visits to act on. */
export function VisitListPanel<T extends { id: string }>({
  id,
  title,
  total,
  items,
  renderItem,
  empty,
  highlighted = false,
  footer,
}: VisitListPanelProps<T>) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`flex min-h-0 min-w-0 scroll-mt-4 flex-col rounded-xl border bg-white transition-colors dark:bg-zinc-800 ${
        highlighted
          ? "border-sky-400 ring-2 ring-sky-200 dark:border-sky-600 dark:ring-sky-900"
          : "border-slate-200 dark:border-zinc-700"
      }`}
    >
      <header className="flex items-center justify-between gap-2 border-b border-slate-100 px-4 py-3 dark:border-zinc-700">
        <h2 id={`${id}-title`} className="text-sm font-semibold text-slate-900 dark:text-zinc-100">
          {title}
        </h2>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 tabular-nums dark:bg-zinc-700 dark:text-zinc-300">
          {total.toLocaleString()}
        </span>
      </header>

      <div className="h-50 overflow-y-auto">
        {items.length === 0 ? (
        <p className="px-4 py-10 text-center text-xs text-slate-400 dark:text-zinc-500">{empty}</p>
      ) : (
        <ul className="divide-y divide-slate-100 dark:divide-zinc-700">
          {items.map((item) => (
            <li key={item.id}>{renderItem(item)}</li>
          ))}
        </ul>
      )}

</div>
     
      {footer && total > items.length && (
        <footer className="mt-auto border-t border-slate-100 px-4 py-2 text-xs dark:border-zinc-700">
          {footer}
        </footer>
      )}
    </section>
  );
}
