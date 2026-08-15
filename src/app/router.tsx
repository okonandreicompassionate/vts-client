import {
  createBrowserRouter,
  isRouteErrorResponse,
  RouterProvider,
  useRouteError,
} from "react-router-dom";
import { paths } from "@/config/paths";
import { TenantLayout } from "@/lib/tenant/tenant-layout";
import { adminRoutes } from "./routes/admin/routes";
import { visitorRoutes } from "./routes/visitor/routes";
import { Spinner } from "@/components/ui/spinner";
import PageError from "@/components/feedback/page-error";

function RouteError() {
  const error = useRouteError();

  const normalizedError = isRouteErrorResponse(error)
    ? new Error(error.statusText || "Page not found")
    : error instanceof Error
      ? error
      : new Error("Unexpected error");

  console.error("Unhandled route error:", normalizedError);

  return (
    <PageError
      error={normalizedError}
      resetErrorBoundary={() => window.location.assign(paths.home.path)}
    />
  );
}

const router = createBrowserRouter([
  {
    HydrateFallback: () => <Spinner variant="screen" />,
    errorElement: <RouteError />,
    element: <TenantLayout />,
    children: [
      ...visitorRoutes,
      {
        path: paths.admin.login.path,
        lazy: async () => {
          const { default: AuthPage } = await import(
            "@/features/auth/components/auth-page"
          );
          return { Component: AuthPage };
        },
      },
      {
        path: paths.admin.signup.path,
        lazy: async () => {
          const { default: AuthPage } = await import(
            "@/features/auth/components/auth-page"
          );
          return { Component: AuthPage };
        },
      },
      ...adminRoutes,
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}