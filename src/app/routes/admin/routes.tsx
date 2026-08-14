import type { RouteObject } from "react-router-dom";

import { paths } from "@/config/paths";
import { ProtectedRoute } from "@/app/protected-route";

export const adminRoutes: RouteObject[] = [
  {
    lazy: async () => {
      const { default: AdminLayout } = await import(
        "./layout/dashboard-layout"
      );

      return {
        Component: () => (
          <ProtectedRoute requiredAuth="admin">
            <AdminLayout />
          </ProtectedRoute>
        ),
      };
    },
    children: [
      {
        path: paths.admin.dashboard.path,
        lazy: async () => {
          const { default: Dashboard } = await import(
            "@/features/visitors/components/visitor-dashboard"
          );

          return { Component: Dashboard };
        },
      },
      {
        path: paths.admin.visitors.path,
        lazy: async () => {
          const { default: Visitors } = await import(
            "@/features/visitors/components/visitors-page"
          );

          return { Component: Visitors };
        },
      },
      {
        path: paths.admin.visitorDetails.path,
        lazy: async () => {
          const { default: VisitorDetails } = await import(
            "@/features/visitors/components/visitor-details"
          );

          return { Component: VisitorDetails };
        },
      },
      {
        path: paths.admin.settings.path,
        lazy: async () => {
          const { default: Settings } = await import(
            "@/features/settings/components/settings"
          );

          return { Component: Settings };
        },
      },
    ],
  },
];
