import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { paths } from "@/config/paths";
import { TenantLayout } from "@/lib/tenant/tenant-layout";

import { adminRoutes } from "./routes/admin/routes";
import { visitorRoutes } from "./routes/visitor/routes";
import { Spinner } from "@/components/ui/spinner";

const router = createBrowserRouter([
  {
    HydrateFallback: () => (
      <Spinner variant="screen" />
    ),
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
