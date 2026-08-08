export interface VisitorSession {
  visitorId: string;
  accessToken: string;
  visitId?: string;
}

export function getVisitorSession(): VisitorSession | null {
  const stored = localStorage.getItem("visitorSession");

  if (!stored) {
    return null;
  }

  try {
    const session = JSON.parse(stored) as Partial<VisitorSession>;

    if (!session.visitorId || !session.accessToken) {
      return null;
    }

    return {
      visitorId: session.visitorId,
      accessToken: session.accessToken,
      visitId: session.visitId,
    };
  } catch {
    return null;
  }
}