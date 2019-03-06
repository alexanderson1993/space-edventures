import firebase from "firebase/app";
import "firebase/auth";

const betaConfig = {
  apiKey: "AIzaSyCfqMdX30iN3z7vUORIbCUk3jBcKG7ad08",
  authDomain: "space-edventures-beta.firebaseapp.com",
  databaseURL: "https://space-edventures-beta.firebaseio.com",
  projectId: "space-edventures-beta",
  storageBucket: "space-edventures-beta.appspot.com",
  messagingSenderId: "382675065790"
};
// Default to space-edventures-beta for testing purposes
var config = {
  apiKey: "AIzaSyCVVfToiT_uUHmongPyreE4wUG2o-Imdy0",
  databaseURL: "https://space-edventures.firebaseio.com",
  storageBucket: "space-edventures.appspot.com",
  authDomain: "space-edventures.firebaseapp.com",
  messagingSenderId: "939242994821",
  projectId: "space-edventures"
};
let authItem;
let baseAuthItem;
if (typeof window !== "undefined") {
  firebase.initializeApp(process.env.REACT_APP_IS_LIVE ? config : betaConfig);
  authItem = firebase.auth();
  baseAuthItem = firebase.auth;
}
export const auth = authItem;
export const baseAuth = baseAuthItem;
