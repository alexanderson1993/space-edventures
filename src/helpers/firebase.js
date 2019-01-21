import firebase from "firebase/app";
import "firebase/auth";

// Default to space-edventures-beta for testing purposes
var config = {
  apiKey:
    process.env.REACT_APP_FIREBASE_API_KEY ||
    "AIzaSyCfqMdX30iN3z7vUORIbCUk3jBcKG7ad08",
  authDomain:
    process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ||
    "space-edventures-beta.firebaseapp.com",
  databaseURL:
    process.env.REACT_APP_FIREBASE_DATABASE_URL ||
    "https://space-edventures-beta.firebaseio.com",
  projectId:
    process.env.REACT_APP_FIREBASE_PROJECT_ID || "space-edventures-beta",
  storageBucket:
    process.env.REACT_APP_FIREBASE_STORAGE_BUCKET ||
    "space-edventures-beta.appspot.com",
  messagingSenderId:
    process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "382675065790"
};

firebase.initializeApp(config);

export const auth = firebase.auth();
