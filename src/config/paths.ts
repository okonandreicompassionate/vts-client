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
      path: "/:orgSlug/admin",
      getHref: (orgSlug: string, redirectTo?: string | null) =>
        `${tenantPath(orgSlug, "/admin")}${
          redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""
        }`,
    },
    signup: {
      path: "/:orgSlug/admin/signup",
      getHref: (orgSlug: string) => tenantPath(orgSlug, "/admin/signup"),
    },
    dashboard: {
      path: "/:orgSlug/admin/dashboard",
      getHref: (orgSlug: string) => tenantPath(orgSlug, "/admin/dashboard"),
    },
    visitors: {
      path: "/:orgSlug/admin/visitors",
      getHref: (orgSlug: string) => tenantPath(orgSlug, "/admin/visitors"),
    },
    visitorDetails: {
      path: "/:orgSlug/admin/visitors/:id",
      getHref: (orgSlug: string, id?: string) =>
        id ? tenantPath(orgSlug, `/admin/visitors/${id}`) : tenantPath(orgSlug, "/admin/visitors"),
    },
    settings: {
      path: "/:orgSlug/admin/settings",
      getHref: (orgSlug: string) => tenantPath(orgSlug, "/admin/settings"),
    },
  },
} as const;
