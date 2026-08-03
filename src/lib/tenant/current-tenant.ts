// lib/tenant/current-tenant.ts

let currentOrgSlug = "";

export function setCurrentOrgSlug(orgSlug: string) {
  currentOrgSlug = orgSlug;
}

export function getCurrentOrgSlug() {
  return currentOrgSlug;
}
