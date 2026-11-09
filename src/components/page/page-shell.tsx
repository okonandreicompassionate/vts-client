import type { ReactNode } from "react";

interface PageShellProps {
  title: string;
  description?: ReactNode;
  /** Buttons shown on the right of the heading (Refresh, Generate Report, primary action…). */
  actions?: ReactNode;
  /**
   * Fit the page to the screen so a `DataTableCard` scrolls inside it (desktop only).
   * Leave off for pages that should scroll as a whole, like the dashboard.
   */
  fill?: boolean;
  children: ReactNode;
}

/**
 * Standard staff page: heading row with actions, then the page content. The layout
 * owns the top bar; the breadcrumb comes from the route's `handle`.
 */
export function PageShell({ title, description, actions, fill = false, children }: PageShellProps) {
  return (
    <div
      className={`flex min-w-0 flex-1 flex-col gap-3 px-3 py-4 md:px-6 ${fill ? "lg:min-h-0" : ""}`}
    >
      {/* Title and actions share one row at every width; the title truncates first. */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-24 flex-1">
          <h1 className="truncate text-lg font-bold text-slate-900 dark:text-zinc-100">{title}</h1>
          {description && (
            <p className="mt-0.5 hidden text-xs text-slate-500 sm:block dark:text-zinc-400">
              {description}
            </p>
          )}
        </div>

        {actions && (
          // On phones the buttons collapse to their icons (see .page-actions in index.css).
          <div className="page-actions flex min-w-0 flex-wrap items-center justify-end gap-2">
            {actions}
          </div>
        )}
      </div>

      {children}
    </div>
  );
}
