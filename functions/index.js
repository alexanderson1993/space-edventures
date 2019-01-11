// require both the firebase function package to define function
// behavior and your local server config function
const functions = require("firebase-functions");
const configureServer = require("./server");

//initialize the server
const server = configureServer();

// create and export the api
exports.graphql = functions.https.onRequest(server);
