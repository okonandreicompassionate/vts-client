import { fetchBaseQuery } from "@reduxjs/toolkit/query";

import { csrfFetch } from "../csrf-fetch";

// The organization comes from the visitor session cookie, so requests carry no tenant in the URL.
export const visitorBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL ?? "",
  credentials: "include",
  fetchFn: csrfFetch,
});
