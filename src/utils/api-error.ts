/**
 * A message for an RTK Query error the user can act on: the server's own
 * message (e.g. "This phone number is already used…"), or a plain-language
 * one for network failures. Server crashes (5xx) fall back to `fallback`.
 */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!error || typeof error !== "object") return fallback;

  const status = "status" in error ? error.status : undefined;

  if (status === "FETCH_ERROR") return "Can't reach the server. Check your connection and try again.";
  if (status === "TIMEOUT_ERROR") return "The server took too long to respond. Please try again.";
  if (typeof status === "number" && status >= 500) return fallback;

  const data = "data" in error ? error.data : undefined;
  const serverMessage =
    data && typeof data === "object" && "message" in data ? data.message : undefined;

  if (typeof serverMessage === "string" && serverMessage.trim()) return serverMessage;
  if (Array.isArray(serverMessage)) {
    const messages = serverMessage.filter((item): item is string => typeof item === "string");
    if (messages.length) return messages.join(". ");
  }

  return fallback;
}
