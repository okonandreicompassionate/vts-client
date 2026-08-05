let currentOrgSlug: string | null = null;

export function setCurrentOrgSlug(orgSlug: string) {
  currentOrgSlug = orgSlug;
}

export function getCurrentOrgSlug(): string | null {
  // Already initialized during this session
  if (currentOrgSlug) {
    return currentOrgSlug;
  }

  // Recover from current URL after refresh
  if (typeof window !== "undefined") {
    const [, slug] = window.location.pathname.split("/");

    if (slug) {
      currentOrgSlug = slug;
      return slug;
    }
  }

  return null;
}