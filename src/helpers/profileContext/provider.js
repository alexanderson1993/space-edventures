import React, { useState, useEffect } from "react";
import ProfileContext from "./";
import propTypes from "prop-types";
import { auth } from "../../helpers/firebase";
import { Query } from "react-apollo";
import graphqlHelper from "../graphQLHelper";
import ME_QUERY from "../../queries/me.graphql";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Update the user state whenever the Firebase auth status changes
  useEffect(() => {
    auth.onAuthStateChanged(userObj => {
      if (userObj) {
        setUser(userObj);
      } else {
        setUser(null);
      }
    });
  }, []);

  return (
    <Query query={ME_QUERY} skip={!user} key={user && user.uid}>
      {graphqlHelper(({ me }) => (
        <ProfileContext.Provider value={{ user: me || {} }}>
          {children}
        </ProfileContext.Provider>
      ))}
    </Query>
  );
};

AuthProvider.propTypes = {
  children: propTypes.node
};
export default AuthProvider;
