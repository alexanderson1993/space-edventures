import React, { useState, useEffect } from "react";
import AuthContext from "./";
import propTypes from "prop-types";
import { auth } from "../../helpers/firebase";
import client from "../../helpers/graphqlClient";
import CREATE_USER from "./createUser.graphql";

const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Update the user state whenever the Firebase auth status changes
  useEffect(() => {
    auth.onAuthStateChanged(userObj => {
      if (loading) setLoading(false);
      if (userObj) {
        setUser(userObj);
      } else {
        setUser(null);
      }
    });
  }, [loading]);

  const actions = {
    login: ({ email, password }) => {
      return auth.signInWithEmailAndPassword(email, password);
    },
    signUp: ({ email, password, birthDate, parentEmail }) => {
      // Create the user record in GraphQL
      return auth.createUserWithEmailAndPassword(email, password).then(res => {
        if (res.additionalUserInfo.isNewUser) {
          // Ignore error if there is a user
          return client
            .mutate({
              mutation: CREATE_USER,
              variables: { birthDate, parentEmail }
            })
            .catch(() => {});
        }
      });
    },
    logout: () => {
      return auth.signOut();
    },
    magicLink: ({ email }) => {
      var actionCodeSettings = {
        // URL must be whitelisted in the Firebase Console.
        url: `${window.location.origin}/accounts/magicLink`,
        // This must be true.
        handleCodeInApp: true
      };
      return auth.sendSignInLinkToEmail(email, actionCodeSettings).then(() => {
        // The link was successfully sent. Inform the user.
        // Save the email locally so you don't need to ask the user for it again
        // if they open the link on the same device.
        window.localStorage.setItem("emailForSignIn", email);
      });
    },
    completeMagicLinkSignin: href => {
      // Confirm the link is a sign-in with email link.
      if (auth.isSignInWithEmailLink(href)) {
        // Additional state parameters can also be passed via URL.
        // This can be used to continue the user's intended action before triggering
        // the sign-in operation.
        // Get the email if available. This should be available if the user completes
        // the flow on the same device where they started it.
        let email = window.localStorage.getItem("emailForSignIn");
        if (!email) {
          // User opened the link on a different device. To prevent session fixation
          // attacks, ask the user to provide the associated email again. For example:
          email = window.prompt("Please provide your email for confirmation");
        }
        // The client SDK will parse the code from the link for you.
        return auth
          .signInWithEmailLink(email, href)
          .then(function(result) {
            // Clear email from storage.
            window.localStorage.removeItem("emailForSignIn");
            return result;
          })
          .then(() => {
            // Ignore error if there is a user
            return client.mutate({ mutation: CREATE_USER }).catch(() => {});
          });
      }
    }
  };
  return (
    <AuthContext.Provider value={{ ...actions, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: propTypes.node
};
export default AuthProvider;
