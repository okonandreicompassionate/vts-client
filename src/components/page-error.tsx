import { Button } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { FallbackProps } from "react-error-boundary";

export default function PageError({ error }: FallbackProps) {
  const navigate = useNavigate();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-slate-50 px-6">
      <h1 className="text-2xl font-semibold text-slate-900">
        Something went wrong
      </h1>

      <p className="max-w-md text-center text-slate-500">
        An unexpected error occurred while rendering this page.
      </p>

      <Button
        type="primary"
        size="large"
        onClick={() => navigate("/")}
      >
        Go Home
      </Button>
    </div>
  );
}
