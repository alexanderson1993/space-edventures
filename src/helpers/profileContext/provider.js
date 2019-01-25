import React, { useState, useEffect } from "react";
import ProfileContext from "./";
import propTypes from "prop-types";
import { auth } from "../../helpers/firebase";
import { Query } from "react-apollo";
import ME_QUERY from "../../queries/me.graphql";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // Update the user state whenever the Firebase auth status changes
  useEffect(() => {
    auth.onAuthStateChanged(userObj => {
      // Needs a timeout to properly delay
      // the fiber reconciliation
      setTimeout(() => {
        setLoading(false);
      }, 0);
      if (userObj) {
        setUser(userObj);
      } else {
        setUser(null);
      }
    });
  }, []);

  return (
    <Query query={ME_QUERY} skip={!user} key={user && user.uid}>
      {({ data, loading: queryLoading }) => (
        <ProfileContext.Provider
          value={{
            user: {
              ...(data ? data.me : {}),
              loading: loading || queryLoading
            }
          }}
        >
          {children}
        </ProfileContext.Provider>
      )}
    </Query>
  );
};

AuthProvider.propTypes = {
  children: propTypes.node
};
export default AuthProvider;
