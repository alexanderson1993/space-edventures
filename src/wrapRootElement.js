import React, { Suspense, useContext } from "react";
import { Loading } from "@arwes/arwes";
import { withScriptjs } from "react-google-maps";
import ErrorBoundary from "./helpers/errorBoundary";
import ArwesProvider from "./layout/arwesProvider";
import GraphQL from "./helpers/graphqlClient";
import AuthProvider from "./helpers/authContext/provider";
import ProfileProvider from "./helpers/profileContext/provider";
import StripeAPIProvider from "./helpers/stripe";
import { ErrorProvider } from "./helpers/errorContext";
import ProfileContext from "./helpers/profileContext";
import css from "@emotion/css";

const MapLoader = () => {
  return null;
};
const MapLoaderWrapped = withScriptjs(MapLoader);

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
        <div
          css={css`
            max-width: 500px;
          `}
        >
          <h1>Account Locked</h1>
          <p>
            To use Space EdVentures, we need to collect parental approval
            verification. Once you are approved by your parent, your account
            will be unlocked.
          </p>
          <p>
            Your parent can also unlock your account at any Space EdVentures
            center. Have your parent ask a Space EdVentures center staff member
            for assistance.
          </p>
          <p>Officer Code: {user.token}</p>
        </div>
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
                        <MapLoaderWrapped
                          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBjNViSP0Sxa7oFUw9A_91gSP51FrgXWJA&v=3.exp&libraries=geometry,drawing,places"
                          loadingElement={<div style={{ height: `100%` }} />}
                        />
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
