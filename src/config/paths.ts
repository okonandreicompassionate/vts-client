import { organizationPath } from "@/utils/organization-path";

const withRedirect = (path: string, redirectTo?: string | null) =>
  redirectTo ? `${path}?redirectTo=${encodeURIComponent(redirectTo)}` : path;

export const paths = {
  // Visitor side - reached from an organization's public link, so it keeps the slug.
  home: {
    path: "/:orgSlug",
    getHref: (orgSlug: string) => organizationPath(orgSlug, "/"),
  },
  register: {
    path: "/:orgSlug/register",
    getHref: (orgSlug: string) => organizationPath(orgSlug, "/register"),
  },
  verify: {
    path: "/:orgSlug/verify",
    getHref: (orgSlug: string) => organizationPath(orgSlug, "/verify"),
  },
  visitorProfile: {
    path: "/:orgSlug/profile",
    getHref: (orgSlug: string) => organizationPath(orgSlug, "/profile"),
  },

  // Admin side - the organization comes from the signed-in session, not the URL.
  admin: {
    login: {
      path: "/login",
      getHref: (redirectTo?: string | null) => withRedirect("/login", redirectTo),
    },
    signup: {
      path: "/signup",
      getHref: () => "/signup",
    },
    dashboard: {
      path: "/dashboard",
      getHref: () => "/dashboard",
    },
    appointments: {
      path: "/appointments",
      getHref: () => "/appointments",
    },
    checkIns: {
      path: "/check-ins",
      getHref: () => "/check-ins",
    },
    visitors: {
      path: "/visitors",
      getHref: () => "/visitors",
    },
    visitorDetails: {
      path: "/visitors/:id",
      getHref: (id?: string) => (id ? `/visitors/${id}` : "/visitors"),
    },
    settings: {
      path: "/settings",
      getHref: () => "/settings",
    },
    employees: {
      path: "/employees",
      getHref: () => "/employees",
    },
    users: {
      path: "/users",
      getHref: () => "/users",
    },
  },
} as const;
