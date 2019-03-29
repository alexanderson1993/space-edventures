import React, { useEffect, useReducer } from "react";
import AuthContext from "./";
import propTypes from "prop-types";
import { auth, baseAuth } from "../../helpers/firebase";
import { client } from "../../helpers/graphqlClient";
import CREATE_USER from "./createUser.graphql";
import ME_QUERY from "../../queries/me.graphql";

function reducer({ loading, user }, action) {
  if (action.type === "gotUser") {
    return {
      loading: false,
      user: {
        ...auth.currentUser,
        id: auth.currentUser && auth.currentUser.uid
      }
    };
  }
  if (action.type === "logout") {
    return { loading: false, user: null };
  }
  return { loading, user };
}
const AuthProvider = ({ children }) => {
  const [{ loading, user }, dispatch] = useReducer(reducer, {
    loading: true,
    user: null
  });
  // Update the user state whenever the Firebase auth status changes
  useEffect(() => {
    auth.onAuthStateChanged(userObj => {
      if (userObj) {
        dispatch({ type: "gotUser" });
      } else {
        dispatch({ type: "logout" });
      }
    });
  }, []);

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
              variables: { birthDate, parentEmail },
              refetchQueries: [
                { query: ME_QUERY, variables: { id: res.user.uid } }
              ]
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
        typeof window !== "undefined" &&
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
        let email =
          typeof window !== "undefined" &&
          window.localStorage.getItem("emailForSignIn");
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
            typeof window !== "undefined" &&
              window.localStorage.removeItem("emailForSignIn");
            return result;
          })
          .then(() => {
            // Ignore error if there is a user
            return client.mutate({ mutation: CREATE_USER }).catch(() => {});
          });
      }
    },
    checkMagicLink: email => {
      return auth
        .fetchSignInMethodsForEmail(email)
        .then(function(signInMethods) {
          if (
            signInMethods.indexOf(
              baseAuth.EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD
            ) !== -1 ||
            signInMethods.indexOf(
              baseAuth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD
            ) !== -1
          ) {
            return true;
          }
          return false;
        });
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
