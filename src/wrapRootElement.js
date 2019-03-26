import React, { Suspense, useContext } from "react";
import { Loading } from "@arwes/arwes";

import ErrorBoundary from "./helpers/errorBoundary";
import ArwesProvider from "./layout/arwesProvider";
import GraphQL from "./helpers/graphqlClient";
import AuthProvider from "./helpers/authContext/provider";
import ProfileProvider from "./helpers/profileContext/provider";
import StripeAPIProvider from "./helpers/stripe";
import { ErrorProvider } from "./helpers/errorContext";
import ProfileContext from "./helpers/profileContext";
import css from "@emotion/css";

const UserLock = ({ children }) => {
  const { user } = useContext(ProfileContext);
  if (user.locked)
    return (
      <div
        css={css`
          display: flex;
          justify-content: center;
          align-items: center;
        `}
      >
        <h1>Account Locked</h1>
        <p
          css={css`
            max-width: 500px;
          `}
        >
          To use Space EdVentures, we need to collect parental approval
          verification. Once you are approved by your parent, your account will
          be unlocked.
        </p>
      </div>
    );
  return children;
};
// eslint-disable-next-line react/display-name,react/prop-types
export default (input = {}) => data => {
  const { ssr } = input;
  const { element } = data;
  // Instantiating store in `wrapRootElement` handler ensures:
  //  - there is fresh store for each SSR page
  //  - it will be called only once in browser, when React mounts
  return (
    <StripeAPIProvider>
      <AuthProvider>
        <GraphQL>
          <ErrorProvider>
            <ProfileProvider>
              <ArwesProvider>
                <ErrorBoundary>
                  <UserLock>
                    {ssr ? (
                      element
                    ) : (
                      <Suspense fallback={<Loading animate />}>
                        {element}
                      </Suspense>
                    )}
                  </UserLock>
                </ErrorBoundary>
              </ArwesProvider>
            </ProfileProvider>
          </ErrorProvider>
        </GraphQL>
      </AuthProvider>
    </StripeAPIProvider>
  );
};
