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

  // Admin side
  admin: {
    login: {
      path: "/admin",
      getHref: (redirectTo?: string | null) =>
        `/admin${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`,
    },
    dashboard: {
      path: "/admindashboard",
      getHref: () => "/admindashboard",
    },
    visitors: {
      path: "/visitorpage",
      getHref: () => "/visitorpage",
    },
    visitorDetails: {
      path: "/visitordetails",
      getHref: (id?: string) => (id ? `/visitordetails?id=${id}` : "/visitordetails"),
    },
    visitorReview: {
      path: "/visitorreview",
      getHref: (id?: string) => (id ? `/visitorreview?id=${id}` : "/visitorreview"),
    },
    settings: {
      path: "/adminsettings",
      getHref: () => "/adminsettings",
    },
  },
} as const;