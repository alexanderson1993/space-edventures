import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { onError } from "apollo-link-error";
import { setContext } from "apollo-link-context";
import { ApolloLink } from "apollo-link";
import { createUploadLink } from "apollo-upload-client";

import { auth } from "./firebase";

const uri =
  process.env.NODE_ENV === "production"
    ? ""
    : "http://localhost:5000/space-edventures/us-central1/api/graphql";

const AuthLink = setContext(async (_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = await auth.currentUser.getIdToken();
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ""
    }
  };
});

const ErrorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const DataLink = createUploadLink({
  uri,
  credentials: "same-origin"
});

const client = new ApolloClient({
  link: ApolloLink.from([AuthLink, ErrorLink, DataLink]),
  cache: new InMemoryCache()
});

export default client;
