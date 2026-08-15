import type { RouteObject } from "react-router-dom";
import { paths } from "@/config/paths";
import { ProtectedRoute } from "@/app/protected-route";

export const visitorRoutes: RouteObject[] = [
  {
    path: paths.home.path,
    lazy: async () => {
      const { default: Landing } = await import(
        "@/features/visits/components/landing-page"
      );

      return { Component: Landing };
    },
  },

  {
    lazy: async () => {
      const { default: VisitorLayout } = await import(
        "./layout/visitor-layout"
      );

      return { Component: VisitorLayout };
    },

    children: [
      {
        path: paths.verify.path,
        lazy: async () => {
          const { default: VerifyIdentity } = await import(
            "@/features/visits/components/verify-identity"
          );

          return { Component: VerifyIdentity };
        },
      },

      {
        element: <ProtectedRoute requiredAuth="visitor-verified" />,
        children: [
          {
            path: paths.register.path,
            lazy: async () => {
              const { default: Registration } = await import(
                "@/features/visits/components/visit-registration"
              );

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
            path: paths.visitorProfile.path,
            lazy: async () => {
              const { default: VisitorProfile } = await import(
                "@/features/visits/components/visitor-profile"
              );

              return { Component: VisitorProfile };
            },
          },
        ],
      },
    ],
  },
];