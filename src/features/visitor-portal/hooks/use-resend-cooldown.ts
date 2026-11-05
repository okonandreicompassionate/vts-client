import { useEffect, useState } from "react";

// Matches the server's per-email resend cooldown.
const RESEND_COOLDOWN_MS = 60_000;

export function useResendCooldown() {
  const [deadlines, setDeadlines] = useState<Record<string, number>>({});
  const [now, setNow] = useState(Date.now);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const remainingSeconds = (email: string) =>
    Math.max(0, Math.ceil(((deadlines[email] ?? 0) - now) / 1000));

  const startCooldown = (email: string, seconds = RESEND_COOLDOWN_MS / 1000) => {
    const sentAt = Date.now();
    setNow(sentAt);
    setDeadlines((current) => ({ ...current, [email]: sentAt + seconds * 1000 }));
  };

  return { remainingSeconds, startCooldown };
}
