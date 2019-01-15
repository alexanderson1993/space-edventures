// require both the firebase function package to define function
// behavior and your local server config function
require("dotenv").config();
const functions = require("firebase-functions");
const configureServer = require("./graphql");

//initialize the server
const server = configureServer();

// create and export the api
exports.api = functions.https.onRequest(server);
