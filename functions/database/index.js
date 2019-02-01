let addUsers = require("./addUsers");
let addDirectors = require("./addDirectors");
let deleteCollections = require("./deleteCollections");
let addRanks = require("./addRanks");
let addSpaceCenters = require("./addSpaceCenters");
let addFlightTypes = require("./addFlightTypes");
let addBadges = require("./addBadges");
let addFlightRecords = require("./addFlightRecords");
let addSimulators = require("./addSimulators");
let addMessages = require("./addMessages");

async function manageDatabase(req, res) {
  // =========================================================================
  // Set up our Firebase Service Connection
  // =========================================================================
  require("dotenv").config();
  const admin = require("firebase-admin");
  const functions = require("firebase-functions");

  if (admin.apps.length) {
    admin.app().delete();
  }
  admin.initializeApp(functions.config().firebase);

  let db = admin.firestore();
  const settings = {
    timestampsInSnapshots: true
  };
  db.settings(settings);

  await deleteCollections(db);
  await refillCollections(db);

  return res.status(200).send(
    JSON.stringify({
      Success: "Function was called successfully"
    })
  );
}

async function refillCollections(db) {
  const [directors, ranks, simulators] = await Promise.all([
    addDirectors(db),
    addRanks(db),
    addSimulators(db)
  ]);
  directorIds = directors.map(director => director.id);
  rankIds = ranks.map(rank => rank.id);
  simulatorIds = simulators.map(sim => sim.id);

  const spaceCenters = await addSpaceCenters(db, directorIds);
  spaceCenterIds = spaceCenters.map(spaceCenter => spaceCenter.id);

  const [flightTypes, badges] = await Promise.all([
    addFlightTypes(db, spaceCenterIds),
    addBadges(db, spaceCenterIds)
  ]);
  badgeIds = badges.map(badge => badge.id);
  flightTypeIds = flightTypes.map(type => type.id);

  const users = await addUsers(db, badgeIds, rankIds);
  userIds = users.map(user => user.id);

  const flightRecords = await addFlightRecords(
    db,
    flightTypeIds,
    userIds,
    simulatorIds
  );
}

module.exports = manageDatabase;
