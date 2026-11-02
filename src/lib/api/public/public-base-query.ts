import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { csrfFetch } from "../csrf-fetch";

// Endpoints that need an organization put it in their own URL
// (see publicOrganizationApiPath), so it is part of each cache key.
export const publicBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL ?? "",
  credentials: "include",
  fetchFn: csrfFetch,
});
