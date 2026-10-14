import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

import { csrfFetch } from "@/lib/api/csrf-fetch";

const graphqlUri = `${(import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "")}/graphql`;

const httpLink = new HttpLink({
  uri: graphqlUri,
  credentials: "include",
  fetch: async (uri, options) => {
    const requestInit = options ?? {};

    return csrfFetch(uri ?? graphqlUri, requestInit);
  },
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          visits: {
            keyArgs: ["orgId", "page", "limit", "status", "search"],
          },
        },
      },
    },
  }),
});