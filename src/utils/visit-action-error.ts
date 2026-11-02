export function getVisitActionErrorMessage(error: unknown, fallback: string): string {
  if (!error || typeof error !== "object") {
    return fallback;
  }

  const responseData = "data" in error ? error.data : undefined;
  const responseMessage =
    responseData && typeof responseData === "object" && "message" in responseData
      ? responseData.message
      : undefined;
  const message =
    typeof responseMessage === "string"
      ? responseMessage
      : Array.isArray(responseMessage)
        ? responseMessage.filter((item): item is string => typeof item === "string").join(", ")
      : "message" in error && typeof error.message === "string"
        ? error.message
        : undefined;
  const status = "status" in error ? error.status : undefined;

  if (message && (typeof status === "number" || typeof status === "string")) {
    return `Request failed (${status}): ${message}`;
  }

  return message ?? fallback;
}
