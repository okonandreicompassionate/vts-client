import type { AuthResponse } from "../types/api-types";

export const getAuthToken = (response: AuthResponse) =>
  response.token ??
  response.accessToken ??
  response.data?.token ??
  response.data?.accessToken ??
  "";