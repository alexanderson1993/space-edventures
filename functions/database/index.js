
function manageDatabase (req, res) {
    // =========================================================================
    // Set up our Firebase Service Connection
    // =========================================================================
    require("dotenv").config();
    // const firebase = require('firebase/app');
    // require('firebase/firestore');

    // let config = {
    //     apiKey: process.env.FIREBASE_API_KEY,
    //     authDomain: process.env.FIREBASE_API_AUTH_DOMAIN,
    //     projectId: process.env.FIREBASE_API_PROJECT_ID
    // };

    // if (!firebase.apps.length) {
    //     firebase.initializeApp(config);
    // }

    // let db = firebase.firestore();

    // db.settings({
    //     timestampsInSnapshots: true
    // });

    // collection_list = [
    //     'Users'
    // ]

    /////////////////////////////////////////// -- Using Functions authentication
    const admin = require('firebase-admin');
    const functions = require('firebase-functions');

    if (!admin.apps.length) {
        admin.initializeApp(functions.config().firebase);
    }

    let db = admin.firestore()
    //////////////////////////////////////////////

    const admin = require('firebase-admin');

    var serviceAccount = require('path/to/serviceAccountKey.json');

    admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
    });

    var db = admin.firestore();

    // =========================================================================
    // Delete current collections
    // =========================================================================
    db.getCollections().then((collections) => {
        console.log('This is a test');
        console.log(collections);
        for (let collection of collections) {
            console.log(`Found collection with id: ${collection.id}`);
        }
    });

    // =========================================================================
    // Add data
    // =========================================================================
    // db.collection('Users').add({
    //     FirstName: 'Tarron',
    //     LastName: 'Lane',
    //     Age: '24'
    // }).then((docRef) => {
    //     console.log('The inserted id is ' + docRef.id)
    // });

    // Example: how to return a value to the sender
    return res.status(200).send(JSON.stringify({Success: 'Function was called successfully'}));
}

function deleteCollection(db, collectionPath, batchSize) {
    var collectionRef = db.collection(collectionPath);
    var query = collectionRef.orderBy('__name__').limit(batchSize);
  
    return new Promise((resolve, reject) => {
      deleteQueryBatch(db, query, batchSize, resolve, reject);
    });
  }
  
  function deleteQueryBatch(db, query, batchSize, resolve, reject) {
    query.get()
      .then((snapshot) => {
        // When there are no documents left, we are done
        if (snapshot.size == 0) {
          return 0;
        }
  
        // Delete documents in a batch
        var batch = db.batch();
        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });
  
        return batch.commit().then(() => {
          return snapshot.size;
        });
      }).then((numDeleted) => {
        if (numDeleted === 0) {
          resolve();
          return;
        }
  
        // Recurse on the next process tick, to avoid
        // exploding the stack.
        process.nextTick(() => {
          deleteQueryBatch(db, query, batchSize, resolve, reject);
        });
      })
      .catch(reject);
  }

module.exports = manageDatabase;

