import React, { Suspense } from "react";
import { Loading } from "@arwes/arwes";
import { ApolloProvider } from "react-apollo";
import ErrorBoundary from "./helpers/errorBoundary";
import Routes from "./routes";
import Layout from "./layout";
import graphqlClient from "./helpers/graphqlClient";
import UserProvider from "./helpers/userContext/provider";
import "./styles.css";

const App = () => (
  <ApolloProvider client={graphqlClient}>
    <UserProvider>
      <Layout>
        <ErrorBoundary>
          <Suspense fallback={<Loading animate />}>
            <Routes />
          </Suspense>
        </ErrorBoundary>
      </Layout>
    </UserProvider>
  </ApolloProvider>
);

export default App;
