const admin = require("firebase-admin");
const functions = require("firebase-functions");
const settings = { timestampsInSnapshots: true };

if (admin.apps.length) {
  admin.app().delete();
}
admin.initializeApp(functions.config().firebase);

const firestore = admin.firestore();
firestore.settings(settings);

const auth = admin.auth;
const storage = admin.storage;

module.exports = admin;
module.exports.firestore = firestore;
module.exports.auth = auth;
module.exports.storage = storage;
