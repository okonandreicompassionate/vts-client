import type { RegistrationValues } from "../types/registration-values";

const key = (orgSlug: string) => `visitor-request-draft:${orgSlug}`;

export function readVisitRequestDraft(orgSlug: string): Partial<RegistrationValues> {
  try {
    const value: unknown = JSON.parse(sessionStorage.getItem(key(orgSlug)) ?? "{}");
    if (!value || typeof value !== "object") return {};
    return Object.fromEntries(
      Object.entries(value).filter(
        ([name, field]) =>
          ["firstName", "lastName", "email", "phoneNo", "purposeOfVisit", "hostId"].includes(
            name,
          ) && typeof field === "string",
      ),
    );
  } catch {
    return {};
  }
}

export function saveVisitRequestDraft(orgSlug: string, values: Partial<RegistrationValues>) {
  try {
    sessionStorage.setItem(key(orgSlug), JSON.stringify(values));
  } catch {
    /* Storage may be disabled. */
  }
}

export function clearVisitRequestDraft(orgSlug: string) {
  try {
    sessionStorage.removeItem(key(orgSlug));
  } catch {
    /* Storage may be disabled. */
  }
}
