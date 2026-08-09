import { tenantPath } from "@/lib/tenant";

export const paths = {
  // Visitor side
  home: {
    path: "/:orgSlug",
    getHref: (orgSlug: string) => tenantPath(orgSlug, "/"),
  },
  register: {
    path: "/:orgSlug/register",
    getHref: (orgSlug: string) => tenantPath(orgSlug, "/register"),
  },
  verify: {
    path: "/:orgSlug/verify",
    getHref: (orgSlug: string) => tenantPath(orgSlug, "/verify"),
  },
  visitorProfile: {
    path: "/:orgSlug/profile",
    getHref: (orgSlug: string) => tenantPath(orgSlug, "/profile"),
  },

  // Admin side
  admin: {
    login: {
      path: "/:orgSlug/login",
      getHref: (orgSlug: string, redirectTo?: string | null) =>
        `${tenantPath(orgSlug, "/admin")}${
          redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""
        }`,
    },
    signup: {
      path: "/:orgSlug/signup",
      getHref: (orgSlug: string) => tenantPath(orgSlug, "/signup"),
    },
    dashboard: {
      path: "/:orgSlug/dashboard",
      getHref: (orgSlug: string) => tenantPath(orgSlug, "/dashboard"),
    },
    visitors: {
      path: "/:orgSlug/visitors",
      getHref: (orgSlug: string) => tenantPath(orgSlug, "/visitors"),
    },
    visitorDetails: {
      path: "/:orgSlug/visitors/:id",
      getHref: (orgSlug: string, id?: string) =>
        id ? tenantPath(orgSlug, `/visitors/${id}`) : tenantPath(orgSlug, "/admin/visitors"),
    },
    settings: {
      path: "/:orgSlug/settings",
      getHref: (orgSlug: string) => tenantPath(orgSlug, "/settings"),
    },
  },
} as const;
