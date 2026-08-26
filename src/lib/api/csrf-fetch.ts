const csrfTokenUrl = `${(import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "")}/csrf-token`;

let csrfToken: string | null = null;
let csrfTokenRequest: Promise<string> | null = null;

const nonMutatingMethods = new Set(["GET", "HEAD", "OPTIONS"]);

const isCsrfFailure = async (response: Response): Promise<boolean> => {
  if (response.status !== 403) {
    return false;
  }

  const body = (await response.clone().json().catch(() => null)) as
    | { code?: unknown; message?: unknown }
    | null;

  return (
    body?.code === "EBADCSRFTOKEN" || body?.message === "invalid csrf token"
  );
};

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
  const requestInput = input instanceof Request ? input : undefined;
  const method = (init.method ?? requestInput?.method ?? "GET")
    .toString()
    .toUpperCase();
  const isMutatingRequest = !nonMutatingMethods.has(method);
  const headers = new Headers(requestInput?.headers);

  new Headers(init.headers).forEach((value, key) => {
    headers.set(key, value);
  });

  if (isMutatingRequest) {
    headers.set("X-CSRF-Token", await getCsrfToken());
  }

  const request = new Request(input, {
    ...init,
    headers,
    credentials: "include" as const,
  });
  const response = await fetch(request.clone());

  if (!isMutatingRequest || !(await isCsrfFailure(response))) {
    return response;
  }

  headers.set("X-CSRF-Token", await getCsrfToken(true));

  return fetch(request.clone());
};