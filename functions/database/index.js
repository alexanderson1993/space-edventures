function manageDatabase(req, res) {
  // =========================================================================
  // Set up our Firebase Service Connection
  // =========================================================================
  require("dotenv").config();
  const admin = require("firebase-admin");
  const functions = require("firebase-functions");

  admin.app().delete();
  // if (!admin.apps.length) {
  admin.initializeApp(functions.config().firebase);
  // }

  let db = admin.firestore();
  const settings = {
    timestampsInSnapshots: true
  };
  db.settings(settings);

  // =========================================================================
  // Delete all current collections, then add in all the new data
  // =========================================================================
  // Fetch list of collectoins
  db.getCollections()
    .then(collections => {
      // Delete all the collections
      Promise.all(
        collections.map(collection =>
          deleteCollection(db, collection.path, 500)
        )
      )
        .then(() => {
          // Add data back in
          rankPromises = addRanks();
          simulatorPromises = addSimulators();

          addDirectors()
            .then(directors => {
              directorIds = directors.map(director => director.id);
              addSpaceCenters(directorIds)
                .then(spaceCenters => {
                  spaceCenterIds = spaceCenters.map(
                    spaceCenter => spaceCenter.id
                  );
                  flightTypePromises = addFlightTypes(spaceCenterIds);
                  badgePromises = addBadges(spaceCenterIds);

                  Promise.all([rankPromises, badgePromises])
                    .then(entities => {
                      rankIds = entities[0].map(rank => rank.id);
                      badgeIds = entities[1].map(badge => badge.id);
                      userPromises = addUsers(badgeIds, rankIds);

                      Promise.all([
                        userPromises,
                        simulatorPromises,
                        flightTypePromises
                      ])
                        .then(entities => {
                          userIds = entities[0].map(user => user.id);
                          simulatorIds = entities[1].map(sim => sim.id);
                          flightTypeIds = entities[2].map(type => type.id);
                          addFlightRecords(
                            flightTypeIds,
                            userIds,
                            simulatorIds
                          );
                          return;
                        })
                        .catch(err => {
                          console.log(err);
                        });
                      return;
                    })
                    .catch(err => {
                      console.log(err);
                    });
                  return;
                })
                .catch(err => {
                  console.log(err);
                });
              return;
            })
            .catch(err => {
              console.log(err);
            });
          return;
        })
        .catch(err => {
          console.log(err);
        });
      return;
    })
    .catch(err => {
      console.log(err);
    });

  function addDirectors() {
    const spaceDirectors = [
      { name: "DirectorA LastNameA", registeredDate: Date("10 October 2010") },
      { name: "DirectorB LastNameB", registeredDate: Date("11 November 2011") }
    ];

    // Add the users to the database, then pass the returned Ids to create the space centers
    return Promise.all(
      spaceDirectors.map(director => db.collection("users").add(director))
    );
  }

  function addRanks() {
    const ranks = [
      { name: "Cadet", description: "You're just starting out", order: 1 },
      { name: "Padawan", description: "You started a while ago", order: 2 },
      {
        name: "Acolyte",
        description: "You've learned magic too, Yay",
        order: 3
      },
      {
        name: "Graduate",
        description: "You're ready for actual combat",
        order: 4
      },
      {
        name: "Ensign",
        description:
          "You can now be trusted with a weapon, but you still only get a red shirt",
        order: 5
      },
      {
        name: "Admiral",
        description: "Seems like you've made it to the top",
        order: 6
      }
    ];
    return Promise.all(ranks.map(rank => db.collection("ranks").add(rank)));
  }

  function addSpaceCenters(directorIds) {
    const spaceCenters = [
      {
        name: "SpaceCenterA",
        registeredDate: Date("10 October 2010"),
        description: "This is the description for Space Center A",
        directorId: directorIds[0]
      },
      {
        name: "SpaceCenterB",
        registeredDate: Date("10 October 2010"),
        description: "This is the description for Space Center B",
        directorId: directorIds[1]
      }
    ];
    return Promise.all(
      spaceCenters.map(spaceCenter =>
        db.collection("spaceCenters").add(spaceCenter)
      )
    );
  }

  function addFlightTypes(spaceCenterIds) {
    const flights = [
      {
        spaceCenterId: spaceCenterIds[0],
        name: "Flight Type A",
        flightHours: 3,
        classHours: 1
      },
      {
        spaceCenterId: spaceCenterIds[0],
        name: "Flight Type B",
        flightHours: 3,
        classHours: 1
      },
      {
        spaceCenterId: spaceCenterIds[1],
        name: "Flight Type A",
        flightHours: 3,
        classHours: 1
      },
      {
        spaceCenterId: spaceCenterIds[1],
        name: "Flight Type B",
        flightHours: 3,
        classHours: 1
      }
    ];

    return Promise.all(
      flights.map(flight => db.collection("flightTypes").add(flight))
    );
  }

  function addBadges(spaceCenterIds) {
    const badges = [
      {
        name: "BadgeA",
        description: "This is the description for Badge A",
        imagePath: "path/to/the/image.png",
        spaceCenterId: spaceCenterIds[0],
        date: Date("10 Oct 2010")
      },
      {
        name: "BadgeB",
        description: "This is the description for Badge B",
        imagePath: "path/to/the/image.png",
        spaceCenterId: spaceCenterIds[0],
        date: Date("10 Oct 2010")
      },
      {
        name: "BadgeC",
        description: "This is the description for Badge C",
        imagePath: "path/to/the/image.png",
        spaceCenterId: spaceCenterIds[1],
        date: Date("10 Oct 2010")
      },
      {
        name: "BadgeD",
        description: "This is the description for Badge D",
        imagePath: "path/to/the/image.png",
        spaceCenterId: spaceCenterIds[1],
        date: Date("10 Oct 2010")
      }
    ];
    return Promise.all(badges.map(badge => db.collection("badges").add(badge)));
  }

  function addUsers(badgeIds, rankIds) {
    const users = [
      {
        name: "ParticipantA",
        registeredDate: Date("10 Oct 2010"),
        displayName: "Star Fox",
        rankId: rankIds[0],
        flightHours: 26,
        classHours: 12,
        badges: [badgeIds[0], badgeIds[1]]
      },
      {
        name: "ParticipantB",
        registeredDate: Date("10 Oct 2010"),
        displayName: "Star Duck",
        rankId: rankIds[1],
        flightHours: 26,
        classHours: 12,
        badges: [badgeIds[0], badgeIds[1]]
      },
      {
        name: "ParticipantC",
        registeredDate: Date("10 Oct 2010"),
        displayName: "Star Bear",
        rankId: rankIds[2],
        flightHours: 26,
        classHours: 12,
        badges: [badgeIds[2], badgeIds[3]]
      },
      {
        name: "ParticipantD",
        registeredDate: Date("10 Oct 2010"),
        displayName: "Star Fish",
        rankId: rankIds[3],
        flightHours: 26,
        classHours: 12,
        badges: [badgeIds[0], badgeIds[3]]
      },
      {
        name: "ParticipantE",
        registeredDate: Date("10 Oct 2010"),
        displayName: "Star Lord",
        rankId: rankIds[4],
        flightHours: 26,
        classHours: 12,
        badges: [badgeIds[1], badgeIds[2]]
      }
    ];
    return Promise.all(users.map(user => db.collection("users").add(user)));
  }

  function addFlightRecords(flightTypeIds, userIds, simulatorIds) {
    const flights = [
      {
        flightTypeId: flightTypeIds[0],
        participantId: userIds[0],
        simulatorId: simulatorIds[0],
        stationId: "NO STATION ID",
        date: Date("10 Oct 2010")
      },
      {
        flightTypeId: flightTypeIds[1],
        participantId: userIds[1],
        simulatorId: simulatorIds[0],
        stationId: "NO STATION ID",
        date: Date("10 Oct 2010")
      },
      {
        flightTypeId: flightTypeIds[2],
        participantId: userIds[2],
        simulatorId: simulatorIds[1],
        stationId: "NO STATION ID",
        date: Date("10 Oct 2010")
      },
      {
        flightTypeId: flightTypeIds[3],
        participantId: userIds[3],
        simulatorId: simulatorIds[1],
        stationId: "NO STATION ID",
        date: Date("10 Oct 2010")
      },
      {
        flightTypeId: flightTypeIds[1],
        participantId: userIds[4],
        simulatorId: simulatorIds[1],
        stationId: "NO STATION ID",
        date: Date("10 Oct 2010")
      },
      {
        flightTypeId: flightTypeIds[1],
        participantId: userIds[3],
        simulatorId: simulatorIds[2],
        stationId: "NO STATION ID",
        date: Date("10 Oct 2010")
      },
      {
        flightTypeId: flightTypeIds[3],
        participantId: userIds[2],
        simulatorId: simulatorIds[2],
        stationId: "NO STATION ID",
        date: Date("10 Oct 2010")
      },
      {
        flightTypeId: flightTypeIds[3],
        participantId: userIds[1],
        simulatorId: simulatorIds[2],
        stationId: "NO STATION ID",
        date: Date("10 Oct 2010")
      }
    ];
    return Promise.all(
      flights.map(flight => db.collection("flightRecords").add(flight))
    );
  }

  function addSimulators() {
    const sims = [
      { name: "USS Enterprise" },
      { name: "Backyard Flying Saucer" },
      { name: "Trumps Space Force Flagship" }
    ];
    return Promise.all(sims.map(sim => db.collection("simulators").add(sim)));
  }

  function addMessages(directorIds, userIds) {
    const messages = [
      {
        from: "",
        to: "",
        read: "",
        content: "This is just a test message",
        sentDate: Date("10 Oct 2010")
      },
      {
        from: "",
        to: "",
        read: "",
        content: "This is just a test message",
        sentDate: Date("10 Oct 2010")
      },
      {
        from: "",
        to: "",
        read: "",
        content: "This is just a test message",
        sentDate: Date("10 Oct 2010")
      },
      {
        from: "",
        to: "",
        read: "",
        content: "This is just a test message",
        sentDate: Date("10 Oct 2010")
      }
    ];
  }

  return res
    .status(200)
    .send(JSON.stringify({ Success: "Function was called successfully" }));
}

// =============================================================================
// Functions for deleting entire collections
// =============================================================================
function deleteCollection(db, collectionPath, batchSize) {
  var collectionRef = db.collection(collectionPath);
  var query = collectionRef.orderBy("__name__").limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, batchSize, resolve, reject);
  });
}

function deleteQueryBatch(db, query, batchSize, resolve, reject) {
  query
    .get()
    .then(snapshot => {
      // When there are no documents left, we are done
      if (snapshot.size === 0) {
        return 0;
      }

      // Delete documents in a batch
      var batch = db.batch();
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      return batch.commit().then(() => {
        return snapshot.size;
      });
    })
    .then(numDeleted => {
      if (numDeleted === 0) {
        resolve();
        return;
      }

      // Recurse on the next process tick, to avoid
      // exploding the stack.
      process.nextTick(() => {
        deleteQueryBatch(db, query, batchSize, resolve, reject);
      });
      return;
    })
    .catch(reject);
}

module.exports = manageDatabase;
