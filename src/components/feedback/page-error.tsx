import { Button } from "antd";
import type { FallbackProps } from "react-error-boundary";

export default function PageError({ error, resetErrorBoundary }: FallbackProps) {
  const errorMessage =
    error instanceof Error ? error.message : "An unexpected error occurred.";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6">
      <h1 className="text-2xl font-bold text-slate-800">
        Something went wrong
      </h1>

      <p className="max-w-md text-center text-slate-500">
        {errorMessage}
      </p>

      <Button type="primary" size="large" onClick={resetErrorBoundary}>
        Try Again
      </Button>
    </div>
  );
}