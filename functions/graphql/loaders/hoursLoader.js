const { firestore } = require("../connectors/firebase");
const {
  flightRecordUserLoader,
  flightRecordLoader
} = require("./flightRecord");
const flightTypeLoader = require("./flightType");
const DataLoader = require("dataloader");

// Load with an object shaped like {userId:1, hourType:"flightHours"}
const hoursLoader = new DataLoader(async docs => {
  return Promise.all(
    docs.map(async ({ userId, hourType }) => {
      const flightUserRecords =
        (await flightRecordUserLoader.load(userId)) || [];
      const flightRecords = await flightRecordLoader.loadMany(
        flightUserRecords.map(f => f.flightRecordId)
      );
      const flightTypes = await Promise.all(
        flightRecords
          .filter(Boolean)
          .map(record => flightTypeLoader.load(record.flightTypeId))
      );
      const hours = flightTypes.reduce(
        (prev, type) => prev + (type[hourType] || 0),
        0
      );
      return hours;
    })
  );
});

module.exports = hoursLoader;
