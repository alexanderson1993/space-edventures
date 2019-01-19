const admin = require("firebase-admin");
const settings = { timestampsInSnapshots: true };

const serviceAccount = {
  type: "service_account",
  project_id: "space-edventures-beta",
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY,
  client_email:
    "firebase-adminsdk-qq8ce@space-edventures-beta.iam.gserviceaccount.com",
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-qq8ce%40space-edventures-beta.iam.gserviceaccount.com"
};

console.log(serviceAccount);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://space-edventures-beta.firebaseio.com"
});

const firestore = admin.firestore();
firestore.settings(settings);

const auth = admin.auth;
const storage = admin.storage;

module.exports = admin;
module.exports.firestore = firestore;
module.exports.auth = auth;
module.exports.storage = storage;
