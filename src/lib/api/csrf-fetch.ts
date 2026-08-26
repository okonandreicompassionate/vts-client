const csrfTokenUrl = `${(import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "")}/csrf-token`;

let csrfToken: string | null = null;
let csrfTokenRequest: Promise<string> | null = null;

const nonMutatingMethods = new Set(["GET", "HEAD", "OPTIONS"]);

const fetchCsrfToken = async (): Promise<string> => {
  const response = await fetch(csrfTokenUrl, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Unable to initialize CSRF protection.");
  }

  const data = (await response.json()) as { csrfToken?: unknown };

  if (typeof data.csrfToken !== "string" || !data.csrfToken) {
    throw new Error("Unable to initialize CSRF protection.");
  }

  csrfToken = data.csrfToken;

  return csrfToken;
};

export const getCsrfToken = async (forceRefresh = false): Promise<string> => {
  if (!forceRefresh && csrfToken) {
    return csrfToken;
  }

  csrfTokenRequest ??= fetchCsrfToken().finally(() => {
    csrfTokenRequest = null;
  });

  return csrfTokenRequest;
};

export const csrfFetch = async (
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<Response> => {
  const method = (init.method ?? "GET").toString().toUpperCase();
  const isMutatingRequest = !nonMutatingMethods.has(method);
  const headers = new Headers(init.headers);

  if (isMutatingRequest) {
    headers.set("X-CSRF-Token", await getCsrfToken());
  }

  const request = {
    ...init,
    headers,
    credentials: "include" as const,
  };
  const response = await fetch(input, request);

  if (!isMutatingRequest || response.status !== 403) {
    return response;
  }

  headers.set("X-CSRF-Token", await getCsrfToken(true));

  return fetch(input, request);
};