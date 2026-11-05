import type { RouteObject } from "react-router-dom";
import { ProtectedRoute } from "@/app/protected-route";
import { paths } from "@/config/paths";
import type { RouteHandle } from "@/lib/router/route-handle";
import {
  adminManagementRoles,
  appointmentRoles,
  checkInRoles,
  dashboardRoles,
  employeeManagementRoles,
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
                handle: { breadcrumb: "Appointments" } satisfies RouteHandle,
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
                handle: { breadcrumb: "Check-ins" } satisfies RouteHandle,
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
                handle: { breadcrumb: "Visitors" } satisfies RouteHandle,
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
                handle: { breadcrumb: "Dashboard" } satisfies RouteHandle,
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
                handle: { breadcrumb: "Settings" } satisfies RouteHandle,
                lazy: async () => {
                  const { default: Settings } =
                    await import("@/features/settings/components/settings");

                  return { Component: Settings };
                },
              },
            ],
          },
          {
            element: <ProtectedRoute requiredRoles={employeeManagementRoles} />,
            children: [
              {
                path: paths.admin.employees.path,
                handle: { breadcrumb: "Employees" } satisfies RouteHandle,
                lazy: async () => {
                  const { default: Employees } =
                    await import("@/features/employees/components/employees");

                  return { Component: Employees };
                },
              },
            ],
          },
          {
            element: <ProtectedRoute requiredRoles={adminManagementRoles} />,
            children: [
              {
                path: paths.admin.users.path,
                handle: { breadcrumb: "Admins" } satisfies RouteHandle,
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
