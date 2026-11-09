export const VISIT_TIME_ZONE = "Africa/Lagos";

export function visitDateKey(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: VISIT_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}
