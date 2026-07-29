import type { AuthResponse } from "../../../lib/api/types";

export const getAuthToken = (response: AuthResponse) =>
  response.token ??
  response.accessToken ??
  response.data?.token ??
  response.data?.accessToken ??
  "";