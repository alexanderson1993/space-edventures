import React, { Component } from "react";
import UserContext from "./";
import propTypes from "prop-types";
import { auth } from "../../helpers/firebase";
// TODO: Replace with the appropriate data structure
const userObj = {
  email: "test@spaceedventures.org",
  profile: require("../../assets/avatar.jpeg"),
  rank: "Captain",
  name: "Alex",
  displayName: "Starblayze",
  classHours: 23,
  flightHours: 32,
  history: [
    {
      date: new Date("June 25,2018"),
      center: "CMSC",
      simulator: "Odyssey",
      station: "Flight Control",
      mission: "Fallout"
    },
    {
      date: new Date("July 15,2018"),
      center: "RSA",
      simulator: "Voyager",
      station: "Security",
      mission: "Intolerance"
    },
    {
      date: new Date("September 4,2018"),
      center: "TLGC",
      simulator: "Artemis",
      station: "Science",
      mission: "Quarantine"
    },
    {
      date: new Date("June 25,2018"),
      center: "CMSC",
      simulator: "Odyssey",
      station: "Flight Control",
      mission: "Fallout"
    },
    {
      date: new Date("July 15,2018"),
      center: "RSA",
      simulator: "Voyager",
      station: "Security",
      mission: "Intolerance"
    },
    {
      date: new Date("September 4,2018"),
      center: "TLGC",
      simulator: "Artemis",
      station: "Science",
      mission: "Quarantine"
    },
    {
      date: new Date("June 25,2018"),
      center: "CMSC",
      simulator: "Odyssey",
      station: "Flight Control",
      mission: "Fallout"
    },
    {
      date: new Date("July 15,2018"),
      center: "RSA",
      simulator: "Voyager",
      station: "Security",
      mission: "Intolerance"
    },
    {
      date: new Date("September 4,2018"),
      center: "TLGC",
      simulator: "Artemis",
      station: "Science",
      mission: "Quarantine"
    }
  ]
};

console.log();
class UserProvider extends Component {
  state = {
    user: userObj,
    login: ({ email, password }) => {
      return auth.signInWithEmailAndPassword(email, password).then(res => {
        this.setState({ user: res.user });
      });
    },
    signUp: ({ email, password }) => {
      return auth.createUserWithEmailAndPassword(email, password).then(res => {
        this.setState({ user: res.user });
      });
    },
    logout: () => {
      return auth.signOut();
    },
    magicLink: ({ email }) => {
      var actionCodeSettings = {
        // URL must be whitelisted in the Firebase Console.
        url: `${window.location.origin}/magicLink`,
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
        return auth.signInWithEmailLink(email, href).then(function(result) {
          // Clear email from storage.
          window.localStorage.removeItem("emailForSignIn");
          return result;
        });
      }
    }
  };
  componentDidMount() {
    // Get regular updates from the auth service to properly update whether the user is logged in or not.
    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ user });
      } else {
        this.setState({ user: null });
      }
    });
  }
  static propTypes = {
    children: propTypes.node
  };

  render() {
    return (
      <UserContext.Provider value={this.state}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}

export default UserProvider;
