import React, { Suspense } from "react";
import { Loading } from "@arwes/arwes";
import { ApolloProvider } from "react-apollo";
import ErrorBoundary from "./helpers/errorBoundary";
import ArwesProvider from "./layout/arwesProvider";
import graphqlClient from "./helpers/graphqlClient";
import AuthProvider from "./helpers/authContext/provider";
import ProfileProvider from "./helpers/profileContext/provider";
import StripeAPIProvider from "./helpers/stripe";
import { ErrorProvider } from "./helpers/errorContext";

// eslint-disable-next-line react/display-name,react/prop-types
export default ({ element }) => {
  // Instantiating store in `wrapRootElement` handler ensures:
  //  - there is fresh store for each SSR page
  //  - it will be called only once in browser, when React mounts
  return (
    <StripeAPIProvider>
      <ApolloProvider client={graphqlClient}>
        <AuthProvider>
          <ErrorProvider>
            <ProfileProvider>
              <ArwesProvider>
                <ErrorBoundary>
                  <Suspense fallback={<Loading animate />}>{element}</Suspense>
                </ErrorBoundary>
              </ArwesProvider>
            </ProfileProvider>
          </ErrorProvider>
        </AuthProvider>
      </ApolloProvider>
    </StripeAPIProvider>
  );
};
