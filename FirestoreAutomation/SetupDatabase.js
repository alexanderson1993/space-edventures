// const firebase = require('firebase');
// require('firebase/firestore');
let FirebaseConfig = require('./.env')

// // Get the config from the environment variables

console.log(typeof(FirebaseConfig));
console.log(FirebaseConfig);
console.log(FirebaseConfig.FireBaseConfig)

// firebase.initializeApp(config)
// let db = firebase.firestore()
// db.settings
// =============================================================================
// Create the Collections
// =============================================================================

// add.js
// adds two integers received as command line arguments