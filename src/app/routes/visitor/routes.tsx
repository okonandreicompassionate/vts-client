import type { RouteObject } from "react-router-dom";
import { paths } from "@/config/paths";
import { ProtectedRoute } from "@/app/protected-route";
import VisitorRegistrationGate from "@/features/visitor-portal/components/visitor-registration-gate";

export const visitorRoutes: RouteObject[] = [
  {
    path: paths.home.path,
    lazy: async () => {
      const { default: Landing } =
        await import("@/features/visitor-portal/components/visitor-landing-page");

      return { Component: Landing };
    },
  },

  {
    lazy: async () => {
      const { default: VisitorLayout } = await import("@/components/layout/visitor-layout");

      return { Component: VisitorLayout };
    },

    children: [
      {
        path: paths.verify.path,
        lazy: async () => {
          const { default: VerifyIdentity } =
            await import("@/features/visitor-portal/components/verify-identity");

          return { Component: VerifyIdentity };
        },
      },

      {
        element: <VisitorRegistrationGate />,
        children: [
          {
            path: paths.register.path,
            lazy: async () => {
              const { default: Registration } =
                await import("@/features/visitor-portal/components/visit-request");

              return { Component: Registration };
            },
          },
        ],
      },

      // Protected visitor profile route
      {
        element: <ProtectedRoute requiredAuth="visitor" />,
        children: [
          {
            path: paths.visitorAppointments.path,
            lazy: async () => {
              const { default: VisitorAppointments } =
                await import("@/features/visitor-portal/components/visitor-appointments");
              return { Component: VisitorAppointments };
            },
          },
          {
            path: paths.visitorProfile.path,
            lazy: async () => {
              const { default: VisitorProfile } =
                await import("@/features/visitor-portal/components/visitor-profile");

              return { Component: VisitorProfile };
            },
          },
        ],
      },
    ],
  },
];
