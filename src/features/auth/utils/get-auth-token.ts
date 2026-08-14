import type { LoginResponse } from "../types/api-types";

export const getAuthToken = (response: LoginResponse) => response.accessToken ?? "";
