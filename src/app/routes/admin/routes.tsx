import type { RouteObject } from "react-router-dom";
import { ProtectedRoute } from "@/app/protected-route";
import { paths } from "@/config/paths";
import {
  adminManagementRoles,
  appointmentRoles,
  checkInRoles,
  dashboardRoles,
  settingsRoles,
  visitorRoles,
} from "@/types/user-role";

export const adminRoutes: RouteObject[] = [
  {
    element: <ProtectedRoute requiredAuth="admin" />,
    children: [
      {
        lazy: async () => {
          const { default: AdminLayout } = await import("@/components/layout/dashboard-layout");

          return { Component: AdminLayout };
        },
        children: [
          {
            element: <ProtectedRoute requiredRoles={appointmentRoles} />,
            children: [
              {
                path: paths.admin.appointments.path,
                lazy: async () => {
                  const { default: Appointments } =
                    await import("@/features/visits/components/appointments-page");

                  return { Component: Appointments };
                },
              },
            ],
          },
          {
            element: <ProtectedRoute requiredRoles={checkInRoles} />,
            children: [
              {
                path: paths.admin.checkIns.path,
                lazy: async () => {
                  const { default: CheckIns } =
                    await import("@/features/visits/components/check-ins-page");

                  return { Component: CheckIns };
                },
              },
            ],
          },
          {
            element: <ProtectedRoute requiredRoles={visitorRoles} />,
            children: [
              {
                path: paths.admin.visitors.path,
                lazy: async () => {
                  const { default: VisitorsRolePage } =
                    await import("@/features/visits/components/visitors-role-page");

                  return { Component: VisitorsRolePage };
                },
              },
            ],
          },
          {
            element: <ProtectedRoute requiredRoles={dashboardRoles} />,
            children: [
              {
                path: paths.admin.dashboard.path,
                lazy: async () => {
                  const { default: Dashboard } =
                    await import("@/features/visits/components/visitor-dashboard");

                  return { Component: Dashboard };
                },
              },
            ],
          },
          {
            element: <ProtectedRoute requiredRoles={settingsRoles} />,
            children: [
              {
                path: paths.admin.settings.path,
                lazy: async () => {
                  const { default: Settings } =
                    await import("@/features/settings/components/settings");

                  return { Component: Settings };
                },
              },
            ],
          },
          {
            element: <ProtectedRoute requiredRoles={adminManagementRoles} />,
            children: [
              {
                path: paths.admin.employees.path,
                lazy: async () => {
                  const { default: Employees } =
                    await import("@/features/employees/components/employees");

                  return { Component: Employees };
                },
              },
              {
                path: paths.admin.users.path,
                lazy: async () => {
                  const { default: Users } = await import("@/features/admins/components/admins");

                  return { Component: Users };
                },
              },
            ],
          },
        ],
      },
    ],
  },
];
