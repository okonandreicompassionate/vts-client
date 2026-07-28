export const paths = {
  // Visitor side
  home: {
    path: "/",
    getHref: () => "/",
  },
  register: {
    path: "/register",
    getHref: () => "/register",
  },
  verify: {
    path: "/verify",
    getHref: () => "/verify",
  },
  visitorProfile: {
    path: "/profile",
    getHref: () => "/profile",
  },

  // Admin side
  admin: {
    login: {
      path: "/admin",
      getHref: (redirectTo?: string | null) =>
        `/admin${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`,
    },
    dashboard: {
      path: "/admin/dashboard",
      getHref: () => "/admin/dashboard",
    },
    visitors: {
      path: "/admin/visitors",
      getHref: () => "/admin/visitors",
    },
    visitorDetails: {
      path: "/admin/visitors/:id",
      getHref: (id?: string) => (id ? `/admin/visitors/${id}` : "/admin/visitors"),
    },
    visitorReview: {
      path: "/admin/visitors/:id/review",
      getHref: (id?: string) => (id ? `/admin/visitors/${id}/review` : "/admin/visitors"),
    },
    settings: {
      path: "/admin/settings",
      getHref: () => "/admin/settings",
    },
  },
} as const;
