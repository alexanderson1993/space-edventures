import React, { Suspense } from "react";
import { Loading } from "@arwes/arwes";
import { ApolloProvider } from "react-apollo";
import ErrorBoundary from "./helpers/errorBoundary";
import Routes from "./routes";
import Layout from "./layout";
import ArwesProvider from "./layout/arwesProvider";
import graphqlClient from "./helpers/graphqlClient";
import AuthProvider from "./helpers/authContext/provider";
import ProfileProvider from "./helpers/profileContext/provider";
import StripeAPIProvider from "./helpers/stripe";
import "./styles.css";

const App = () => (
  <StripeAPIProvider>
    <ApolloProvider client={graphqlClient}>
      <ArwesProvider>
        <AuthProvider>
          <Layout>
            <ErrorBoundary>
              <ProfileProvider>
                <Suspense fallback={<Loading animate />}>
                  <Routes />
                </Suspense>
              </ProfileProvider>
            </ErrorBoundary>
          </Layout>
        </AuthProvider>
      </ArwesProvider>
    </ApolloProvider>
  </StripeAPIProvider>
);

export default App;
