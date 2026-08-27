import { useMemo } from "react";
import { Button } from "antd";
import type { FallbackProps } from "react-error-boundary";
import { paths } from "@/config/paths";
import { getPreviousRoute } from "@/lib/router/route-history";

type ErrorVariant = "not-found" | "chunk-load" | "unexpected";

function detectVariant(error: unknown): ErrorVariant {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    if (
      /not found|page not found|404|route not found|no route matches|cannot find the requested page/i.test(
        message,
      )
    ) {
      return "not-found";
    }

    if (
      /failed to fetch dynamically imported module|loading chunk \d+ failed|chunkloaderror/i.test(
        message,
      )
    ) {
      return "chunk-load";
    }
  }

  return "unexpected";
}

function hashToReferenceCode(input: string): string {
  let hash = 0;

  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }

  return Math.abs(hash).toString(36).slice(0, 6).toUpperCase();
}

const COPY: Record<
  ErrorVariant,
  {
    heading: string;
    description: string;
    actionLabel: string;
  }
> = {
  "not-found": {
    heading: "Oops! Page not found",
    description:
      "The page you're looking for doesn't exist, may have been moved, or the URL may be incorrect.",
    actionLabel: "Go home",
  },

  "chunk-load": {
    heading: "New version available",
    description:
      "This app was updated since you opened it. Reload to get the latest version.",
    actionLabel: "Reload page",
  },

  unexpected: {
    heading: "Something went wrong",
    description:
      "We hit a snag loading this page. If it keeps happening, let us know.",
    actionLabel: "Try again",
  },
};

export default function PageError({
  error,
  resetErrorBoundary,
}: FallbackProps) {
  const variant = detectVariant(error);
  const copy = COPY[variant];

  const isDev = import.meta.env.DEV;

  const rawMessage =
    error instanceof Error
      ? error.message
      : "An unexpected error occurred.";

  const rawStack = error instanceof Error ? error.stack ?? "" : "";

  const errorId = useMemo(
    () => hashToReferenceCode(rawMessage + rawStack),
    [rawMessage, rawStack],
  );

  const description =
    isDev && variant === "unexpected" ? rawMessage : copy.description;

  const handleAction = () => {
    if (variant === "chunk-load") {
      window.location.reload();
      return;
    }

    if (variant === "not-found") {
      const previousRoute = getPreviousRoute();

      if (previousRoute?.orgSlug) {
        const destination =
          previousRoute.area === "admin"
            ? paths.admin.login.getHref(previousRoute.orgSlug)
            : paths.home.getHref(previousRoute.orgSlug);

        window.location.assign(destination);
        return;
      }

      resetErrorBoundary();
      return;
    }

    resetErrorBoundary();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
        {copy.heading}
      </h1>

      <p className="max-w-md text-center text-slate-500 dark:text-slate-400">
        {description}
      </p>

      {variant === "unexpected" && !isDev && (
        <p className="text-xs text-slate-400 dark:text-slate-500">
          Reference: {errorId}
        </p>
      )}

      {isDev &&
        variant === "unexpected" &&
        error instanceof Error &&
        error.stack && (
          <pre className="max-w-lg overflow-auto rounded bg-slate-100 p-3 text-left text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {error.stack}
          </pre>
        )}

      <Button
        type="primary"
        size="large"
        onClick={handleAction}
        className="h-6.5!"
      >
        {copy.actionLabel}
      </Button>
    </div>
  );
}