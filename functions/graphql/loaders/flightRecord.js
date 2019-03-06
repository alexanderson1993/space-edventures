const { firestore } = require("../connectors/firebase");
const DataLoader = require("dataloader");

const flightRecordLoader = new DataLoader(async ids => {
  const documentRefs = ids.map(id => firestore().doc(`flightRecords/${id}`));
  const documents = await firestore()
    .getAll(documentRefs)
    .then(docs =>
      ids.map(id => {
        const doc = docs.find(d => d.id === id);
        if (!doc.exists) return null;
        return { ...doc.data(), id: doc.id };
      })
    );

  return documents;
});

const flightRecordUserLoader = new DataLoader(async userIds => {
  let allFlightRecords = await firestore()
    .collection("flightRecords")
    .get()
    .then(ref => ref.docs.map(d => ({ ...d.data(), id: d.id })));

  return userIds.map(userId => {
    return (
      allFlightRecords
        .filter(doc =>
          doc.simulators.find(sim =>
            sim.stations.find(station => station && station.userId === userId)
          )
        )
        // Map the filtered results to flight record objects
        .map(doc => {
          return {
            ...doc,
            simulators: doc.simulators
              .map(sim => ({
                ...sim,
                // Only include the stations or stations that the user is on
                stations: sim.stations.filter(
                  station => station && station.userId === userId
                )
              }))
              .filter(sim => sim.stations.length > 0)
          };
        })
    );
  });
});

module.exports.flightRecordLoader = flightRecordLoader;
module.exports.flightRecordUserLoader = flightRecordUserLoader;
