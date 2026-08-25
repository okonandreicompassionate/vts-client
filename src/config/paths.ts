import { organizationPath } from "@/features/organizations";

export const paths = {
  // Visitor side
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

  // Admin side
  admin: {
    login: {
      path: "/:orgSlug/login",
      getHref: (orgSlug: string, redirectTo?: string | null) =>
        `${organizationPath(orgSlug, "/login")}${
          redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""
        }`,
    },
    signup: {
      path: "/:orgSlug/signup",
      getHref: (orgSlug: string) => organizationPath(orgSlug, "/signup"),
    },
    dashboard: {
      path: "/:orgSlug/dashboard",
      getHref: (orgSlug: string) => organizationPath(orgSlug, "/dashboard"),
    },
    visitors: {
      path: "/:orgSlug/visitors",
      getHref: (orgSlug: string) => organizationPath(orgSlug, "/visitors"),
    },
    visitorDetails: {
      path: "/:orgSlug/visitors/:id",
      getHref: (orgSlug: string, id?: string) =>
        id ? organizationPath(orgSlug, `/visitors/${id}`) : organizationPath(orgSlug, "/visitors"),
    },
    settings: {
      path: "/:orgSlug/settings",
      getHref: (orgSlug: string) => organizationPath(orgSlug, "/settings"),
    },
    employees: {
      path: "/:orgSlug/employees",
      getHref: (orgSlug: string) => organizationPath(orgSlug, "/employees"),
    },
    users: {
      path: "/:orgSlug/users",
      getHref: (orgSlug: string) => organizationPath(orgSlug, "/users"),
    },
    userDetails: {
      path: "/:orgSlug/users/:id",
      getHref: (orgSlug: string, id?: string) =>
        id ? organizationPath(orgSlug, `/users/${id}`) : organizationPath(orgSlug, "/users"),
    },
  },
  notification: {
    notificationStream: {
      path: "/:orgSlug/notifications/stream",
      getHref: (orgSlug: string) => organizationPath(orgSlug, "/notifications/stream"),
    },
    visitStream: {
      path: "/:orgSlug/visits/stream",
      getHref: (orgSlug: string) => organizationPath(orgSlug, "/visits/stream"),
    },
  },
} as const;
