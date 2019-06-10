// require both the firebase function package to define function
// behavior and your local server config function
require("dotenv").config();
const functions = require("firebase-functions");
const configureServer = require("./graphql");

// Code to manage the database
// const manageDatabase = require("./database");

//initialize the server
const server = configureServer();

// create and export the api
exports.api = functions.https.onRequest(server);
// exports.manageDatabase = functions.https.onRequest(manageDatabase);
