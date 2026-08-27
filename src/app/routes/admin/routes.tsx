import type { RouteObject } from "react-router-dom";
import { paths } from "@/config/paths";
import { ProtectedRoute } from "@/app/protected-route";

export const adminRoutes: RouteObject[] = [
  {
    element: <ProtectedRoute requiredAuth="admin" />,
    children: [
      {
        lazy: async () => {
          const { default: AdminLayout } = await import("./layout/dashboard-layout");

          return {
            Component: AdminLayout,
          };
        },

        children: [
          {
            path: paths.admin.dashboard.path,
            lazy: async () => {
              const { default: Dashboard } =
                await import("@/features/visits/components/visitor-dashboard");

              return {
                Component: Dashboard,
              };
            },
          },

          {
            path: paths.admin.visitors.path,
            lazy: async () => {
              const { default: Visitors } =
                await import("@/features/visits/components/visitors-page");

              return {
                Component: Visitors,
              };
            },
          },

          {
            path: paths.admin.visitorDetails.path,
            lazy: async () => {
              const { default: VisitorDetails } =
                await import("@/features/visits/components/visitor-details");

              return {
                Component: VisitorDetails,
              };
            },
          },

          {
            path: paths.admin.settings.path,
            lazy: async () => {
              const { default: Settings } = await import("@/features/settings/components/settings");

              return {
                Component: Settings,
              };
            },
          },
          {
            path: paths.admin.employees.path,
            lazy: async () => {
              const { default: Employees } =
                await import("@/features/employees/components/employees");

              return {
                Component: Employees,
              };
            },
          },
          {
            path: paths.admin.users.path,
            lazy: async () => {
              const { default: Users } = await import("@/features/users/components/users");

              return {
                Component: Users,
              };
            },
          },
          {
            path: paths.admin.userDetails.path,
            lazy: async () => {
              const { default: UserDetails } =
                await import("@/features/users/components/user-details");

              return {
                Component: UserDetails,
              };
            },
          },
        ],
      },
    ],
  },
];
