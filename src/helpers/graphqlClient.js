import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { onError } from "apollo-link-error";
import { setContext } from "apollo-link-context";
import { ApolloLink } from "apollo-link";
import { createUploadLink } from "apollo-upload-client";
import { ApolloProvider } from "react-apollo";
import { ApolloProvider as ApolloHooksProvider } from "react-apollo-hooks";

import fetch from "isomorphic-fetch";

import { auth } from "./firebase";
import React, { useContext } from "react";
import AuthContext from "./authContext";

const uri =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_IS_LIVE
      ? "https://us-central1-space-edventures.cloudfunctions.net/api/graphql"
      : "https://us-central1-space-edventures-beta.cloudfunctions.net/api/graphql"
    : "http://localhost:5000/space-edventures-beta/us-central1/api/graphql";

const AuthLink = setContext(async (_, { headers }) => {
  // get the authentication token from local storage if it exists
  try {
    const token = await auth.currentUser.getIdToken();
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : ""
      }
    };
  } catch (err) {
    return headers;
  }
});

const ErrorLink = onError(({ graphQLErrors, networkError }) => {
  // if (graphQLErrors)
  //   graphQLErrors.map(({ message, locations, path }) =>
  //     // console.error(
  //     //   `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
  //     // )
  //   );
  // if (networkError) console.error(`[Network error]: ${networkError}`);
});

const DataLink = createUploadLink({
  uri,
  credentials: "same-origin"
});

export const client = new ApolloClient({
  link: ApolloLink.from([AuthLink, ErrorLink, DataLink]),
  cache: new InMemoryCache(),
  fetch: typeof window !== "undefined" ? window.fetch : fetch
});

export default ({ children }) => {
  const { loading } = useContext(AuthContext);
  if (!loading)
    return (
      <ApolloProvider client={client}>
        <ApolloHooksProvider client={client}>{children}</ApolloHooksProvider>
      </ApolloProvider>
    );
  return null;
};
