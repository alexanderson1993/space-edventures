
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

    // const admin = require('firebase-admin');

    // var serviceAccount = require('../Space_Edventures_Beta-dfbb4cd91042.json');

    // admin.initializeApp({
    //     credential: admin.credential.cert(serviceAccount)
    // });

    // var db = admin.firestore();

    // =========================================================================
    // Delete all current collections
    // =========================================================================
    db.getCollections().then((collections) => {
        for (let collection of collections) {
            deleteCollection(db, collection.path, 500);
            //console.log(collection.path);
        }
    });

    // =========================================================================
    // Create some Directors (and store their Id's so we can attach the Space Centers to them)
    // =========================================================================
    spaceDirectorIds = []
    spaceDirectorPromises = []
    spaceDirectors = [
        ['DirectorA LastNameA', Date('10 October 2010')],
        ['DirectorB LastNameB', Date('11 November 2011')]
    ]

    for (let director of directors) {
        spaceDirectorPromises.push(db.collection('Users').add({
            name: director[0],
            registeredDate: director[1],
        }).then((ref) => {
            spaceDirectorIds.push(ref.id);
        }));
    }

    // =============================================================================
    // Create the Space Centers (and keep ID's so we can add badges to them)
    // =============================================================================
    Promise.all(spaceDirectorPromises).then(() => {
        // create the space centers, using the ids from the space director array
    });
    function addSpaceCenters() {

    }

    // =========================================================================
    // Add Badges (and keep ID's so we can add them to users)
    // =========================================================================
    // let badges = [
    //     []
    // ]

    // badgesPromise = db.collection('Badges').add({
    //     Name: 'BadgeA',
    //     Description: 'The first test badge that Tarron created.',
    //     ImageOrLogo: 'path/to/image',
    //     SpaceCenterId: ''
    //     FlightId:           
    //     Date: Date()
    // });

    // =========================================================================
    // Add Users
    // =========================================================================
    // let users = [
    //     ['Tarron', 'Lane', '24']
    // ]
    
    // db.collection('Users').add({
    //     Name: 'Tarron Lane',
    //     RegisteredDate: new Date('December 10, 1815'),
    //     Age: '24',
    //     DisplayName: '',
    //     RankId: '',
    //     FlightHours: '',
    //     ClassHours: '',
    //     Badges: [10,11,12,13]
    //     //- Collection : [FlightRecord] 
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

