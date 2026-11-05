import { useRef } from "react";

/** Keep the same key for retries of one payload; clear only after success. */
export function useSubmissionKey(scope: string) {
  const memory = useRef<{ payload: string; key: string } | null>(null);
  const storageKey = `submission:${scope}`;
  const getKey = (payload: unknown) => {
    const serialized = JSON.stringify(payload);
    if (memory.current?.payload === serialized) return memory.current.key;
    try {
      const stored: unknown = JSON.parse(sessionStorage.getItem(storageKey) ?? "null");
      if (
        stored &&
        typeof stored === "object" &&
        "payload" in stored &&
        stored.payload === serialized &&
        "key" in stored &&
        typeof stored.key === "string"
      ) {
        memory.current = { payload: serialized, key: stored.key };
        return stored.key;
      }
    } catch {
      /* Storage may be unavailable. */
    }
    const next = { payload: serialized, key: crypto.randomUUID() };
    memory.current = next;
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      /* The in-memory key still protects retries. */
    }
    return next.key;
  };
  const complete = () => {
    memory.current = null;
    try {
      sessionStorage.removeItem(storageKey);
    } catch {
      /* Storage may be unavailable. */
    }
  };
  return { getKey, complete };
}
