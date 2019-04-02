import firebase from "firebase/app";
import "firebase/auth";

var config = {
  apiKey: process.env.FIREBASE_API_KEY,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  messagingSenderId: process.env.FIREBASE_MESSAGE_SENDER_ID,
  projectId: process.env.FIREBASE_PROJECT_ID
};
let authItem;
let baseAuthItem;
if (typeof window !== "undefined") {
  firebase.initializeApp(config);
  authItem = firebase.auth();
  baseAuthItem = firebase.auth;
}
export const auth = authItem;
export const baseAuth = baseAuthItem;
