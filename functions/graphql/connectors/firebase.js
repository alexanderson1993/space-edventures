// =============================================================================
// Create the firebase connector for GraphQL
// =============================================================================
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const settings = { timestampsInSnapshots: true };


// Delete the firebase admin app if it is already created (to avoid the error: Default App already exists)
if (admin.apps.length) {
    admin.app().delete();
}

// Create admin app using the function credentials
admin.initializeApp(functions.config().firebase);

// Create and configure the firestore client
const firestore = admin.firestore();
firestore.settings(settings);

const auth = admin.auth;
const storage = admin.storage;

module.exports = admin;
if (process.env.NODE_ENV !== "production") {
    // So that we can use client functions (for testing)
    const firebaseClientSide = require("firebase");
    let clientSideConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: "space-edventures-beta.firebaseapp.com",
    databaseUrl: "https://space-edventures-beta.firebaseio.com"
    };
    let clientSideApp = firebaseClientSide.initializeApp(clientSideConfig);

    module.exports.clientSideApp = clientSideApp;
}
module.exports.firestore = firestore;
module.exports.auth = auth;
module.exports.storage = storage;
